"""
Webdav Client

"""
import os
import json
import hashlib
import datetime
import uuid
import tempfile
from operator import attrgetter
from numbers import Number
import xml.etree.cElementTree as xml
import xml.etree.ElementTree as ET
from collections import namedtuple
from http.client import responses as HTTP_CODES
from urllib.parse import urlparse, unquote

import requests
from django.utils.timezone import make_naive, make_aware
from django.utils.dateparse import parse_datetime
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.core.cache import cache
from django.template.defaultfilters import filesizeformat



DOWNLOAD_CHUNK_SIZE_BYTES = 1 * 1024 * 1024

class WebdavException(Exception):
    pass

class ConnectionFailed(WebdavException):
    pass


def codestr(code):
    return HTTP_CODES.get(code, 'UNKNOWN')


KEYS = ['name', 'path','size', 'mtime', 'ctime', 'contenttype', 'icon', 'readable_size']
File = namedtuple('File', KEYS)


def prop(elem, name, default=None):
    child = elem.find('.//{DAV:}' + name)
    return default if child is None else unquote(child.text)

def parse_icon(contenttype):
    if 'directory' in contenttype:
        return 'folder'
    elif 'image' in contenttype:
        return 'image'
    elif 'video' in contenttype:
        return 'video'
    else:
        return 'file'


def without_root(uri, skip=1):
    """
    delete root dir
    eg: /4/Documents/ to /Documents/
    """
    if not skip:
        return uri

    #uri_list = uri.split('/')
    #if len(uri_list) > 2:
    #    del uri_list[1]
    #return '/'.join(uri_list)
    return uri


def elem2file(elem, skip=1):
    contenttype = elem.find('.//{DAV:}getcontenttype')
    if contenttype and 'directory' in contenttype.text:
        name = prop(elem, 'href')
    else:
        name = prop(elem, 'href').split('/')[-1]

    return File(
        unquote(name),
        without_root(prop(elem, 'href'), skip),
        int(prop(elem, 'getcontentlength', 0)),
        # parse_datetime(prop(elem, 'getlastmodified', '')),
        datetime.datetime.strptime(
            prop(elem, 'getlastmodified', ''),
            '%a, %d %b %Y %H:%M:%S %Z'
        ) + datetime.timedelta(hours=8),
        # prop(elem, 'getlastmodified', ''),
        parse_datetime(prop(elem, 'creationdate', '')),
        # TODO custom contenttype
        prop(elem, 'getcontenttype', ''),
        #
        parse_icon(prop(elem, 'getcontenttype', '')),
        filesizeformat(prop(elem, 'getcontentlength', 0)),
    )


class OperationFailed(WebdavException):
    _OPERATIONS = dict(
        HEAD = "get header",
        GET = "download",
        PUT = "upload",
        DELETE = "delete",
        MKCOL = "create directory",
        PROPFIND = "list directory",
        )

    def __init__(self, method, path, expected_code, actual_code):
        self.method = method
        self.path = path
        self.expected_code = expected_code
        self.actual_code = actual_code
        operation_name = self._OPERATIONS[method]
        self.reason = 'Failed to {operation_name} "{path}"'.format(**locals())
        expected_codes = (expected_code,) if isinstance(expected_code, Number) else expected_code
        expected_codes_str = ", ".join('{0} {1}'.format(code, codestr(code)) for code in expected_codes)
        actual_code_str = codestr(actual_code)
        msg = '''\
{self.reason}.
  Operation     :  {method} {path}
  Expected code :  {expected_codes_str}
  Actual code   :  {actual_code} {actual_code_str}'''.format(**locals())
        super(OperationFailed, self).__init__(msg)



class Client:
    def __init__(self, host, port=80, auth=None, username=None, password=None,
                 protocol='http', verify_ssl=True, path=None, cert=None):
        self.baseurl = '{0}://{1}:{2}'.format(protocol, host, port)
        # use host
        self.host = self.baseurl
        if path:
            self.baseurl = '{0}/{1}'.format(self.baseurl, path)
        self.cwd = '/'
        self.session = requests.session()
        self.session.verify = verify_ssl
        self.session.stream = True

        if cert:
            self.session.cert = cert

        if auth:
            self.session.auth = auth
        elif username and password:
            self.session.auth = (username, password)


    def _send(self, method, path, expected_code, **kwargs):
        url = self._get_url(path)
        response = self.session.request(method, url, allow_redirects=False, **kwargs)
        if isinstance(expected_code, Number) and response.status_code != expected_code \
            or not isinstance(expected_code, Number) and response.status_code not in expected_code:
            raise OperationFailed(method, path, expected_code, response.status_code)
        return response

    def _get_url(self, path):
        path = str(path).strip()
        if path.startswith('/'):
            return self.baseurl + path
        return "".join((self.baseurl, self.cwd, path))

    def cd(self, path):
        path = path.strip()
        if not path:
            return
        stripped_path = '/'.join(part for part in path.split('/') if part) + '/'
        if stripped_path == '/':
            self.cwd = stripped_path
        elif path.startswith('/'):
            self.cwd = '/' + stripped_path
        else:
            self.cwd += stripped_path

    def mkdir(self, path, safe=False):
        expected_codes = 201 if not safe else (201, 301, 405)
        self._send('MKCOL', path, expected_codes)

    def mkdirs(self, path):
        dirs = [d for d in path.split('/') if d]
        if not dirs:
            return
        if path.startswith('/'):
            dirs[0] = '/' + dirs[0]
        old_cwd = self.cwd
        try:
            for dir in dirs:
                try:
                    self.mkdir(dir, safe=True)
                except Exception as e:
                    if e.actual_code == 409:
                        raise
                finally:
                    self.cd(dir)
        finally:
            self.cd(old_cwd)

    def rmdir(self, path, safe=False):
        path = str(path).rstrip('/') + '/'
        expected_codes = 204 if not safe else (204, 404)
        self._send('DELETE', path, expected_codes)

    def delete(self, path):
        self._send('DELETE', path, 204)

    # def upload(self, local_path_or_fileobj, remote_path):
    #     if isinstance(local_path_or_fileobj, basestring):
    #         with open(local_path_or_fileobj, 'rb') as f:
    #             self._upload(f, remote_path)
    #     else:
    #         self._upload(local_path_or_fileobj, remote_path)



    # def _upload(self, fileobj, remote_path):
    #     self._send('PUT', remote_path, (200, 201, 204), data=fileobj)

    def upload(self, remote_path, fileobj):
        res = self.session.request(
            'PUT',
            self.host + remote_path,
            data=fileobj)

        return res


    def path(self, remote_path):
        # return local storage file path
        # cache filename
        fileinfo = self.info(remote_path)
        ext = os.path.splitext(remote_path)[-1]
        filename = hashlib.md5(remote_path.encode('utf8')).hexdigest()
        # filename = f'cache/{uuid.uuid4()}{ext}'
        filename = f'cache/{filename}{ext}'

        # if file is exist
        if default_storage.exists(filename):
            # print(make_naive(default_storage.get_created_time(filename)))
            # print(fileinfo.mtime)
            if make_naive(default_storage.get_created_time(filename)) >= fileinfo.mtime:
                # if file is new
                return filename

            # if file is old, delete
            default_storage.delete(filename)

        r = self._send('GET', remote_path, 200, stream=True)
        res = default_storage.save(filename, ContentFile(r.content))
        return res



    def open(self, remote_path):
        # save file to local storage
        fileinfo = self.info(remote_path)
        if not fileinfo:
            return None, None

        # cache filename
        ext = os.path.splitext(remote_path)[-1]
        filename = hashlib.md5(remote_path.encode('utf8')).hexdigest()
        # filename = f'cache/{uuid.uuid4()}{ext}'
        filename = f'cache/{filename}{ext}'

        # if file is exist
        if default_storage.exists(filename):
            # print(make_naive(default_storage.get_created_time(filename)))
            # print(fileinfo.mtime)
            if make_naive(default_storage.get_created_time(filename)) >= fileinfo.mtime:
                # if file is new
                return filename, ext

            # if file is old, delete
            default_storage.delete(filename)

        r = self._send('GET', remote_path, 200, stream=True)
        res = default_storage.save(filename, ContentFile(r.content))
        # return default_storage.url(res)
        return res, ext


    def direct_download(self, uri):
        """ 220414 use Streamingresponse of django """
        return self._send('GET', uri, 200, stream=True)


    # deprecated
    def download(self, remote_path, local_path_or_fileobj):
        response = self._send('GET', remote_path, 200, stream=True)
        if isinstance(local_path_or_fileobj, basestring):
            with open(local_path_or_fileobj, 'wb') as f:
                self._download(f, response)
        else:
            self._download(local_path_or_fileobj, response)

    # deprecated
    def _download(self, fileobj, response):
        for chunk in response.iter_content(DOWNLOAD_CHUNK_SIZE_BYTES):
            fileobj.write(chunk)

    def info(self, remote_path='.'):
        # return uri info
        if not self.exists(remote_path):
            return None

        res = self.ls(remote_path)
        if res:
            return res[0]
        return None

    def total(self, remote_path):
        data = ET.Element('D:propfind', {'xmlns:D':'DAV:'})
        ET.SubElement(data, 'D:allprop')
        res = self.session.request(
            'PROPFIND',
            self.host + remote_path,
            headers = {
                'Depth': 'infinity',
                'Content-Type': 'text/xml'
            },
            data=ET.dump(data)
        )
        # tree = xml.fromstring(res.content)
        # return [elem2file(elem) for elem in tree.findall('{DAV:}response')]
        return res


    # deprecated
    def collection_tree(self, remote_path='/'):
        # WRANING DavDepthInfinity on|off
        # https://httpd.apache.org/docs/2.4/mod/mod_dav.html
        # data = ET.Element('D:propfind', {'xmlns:D':'DAV:'})
        # ET.SubElement(data, 'D:allprop')

        # res = self.session.request(
        #     'PROPFIND',
        #     self.host + remote_path,
        #     headers = {
        #         # 'Depth': '1',
        #         'Depth': 'infinity',
        #         'Content-Type': 'text/xml'
        #     },
        #     data=ET.dump(data)
        # )
        # return res
        def subdir(path, paths, root='/'):
            children = []
            for row in self.ls(path):
                if row.path != without_root(path) and 'directory' in row.contenttype:
                    absolute_path = root + row.path
                    subdir(absolute_path.replace('//', '/'), children, root)

            paths.append({
                'path': without_root(path),
                'children': children
            })
            return paths

        paths = subdir(remote_path, [], remote_path)
        return paths[0]['children']



    def ls(self, remote_path='.', skip=1):
        cache_key = f'webdav_ls_{remote_path}'
        # cached_res = cache.get(cache_key)
        # if cached_res:
        #     return cached_res

        headers = {'Depth': '1'}
        response = self._send('PROPFIND', remote_path, (207, 301), headers=headers)

        # Redirect
        if response.status_code == 301:
            url = urlparse(response.headers['location'])
            return self.ls(url.path, skip)

        tree = xml.fromstring(response.content)
        #res = [elem2file(elem, skip) for elem in tree.findall('{DAV:}response')]
        files = []
        dirs = []
        for elem in tree.findall('{DAV:}response'):
            f = elem2file(elem, skip)
            if f.contenttype == 'httpd/unix-directory':
                dirs.append(f)
            else:
                files.append(f)

        # return sorted(res, key=attrgetter('path'))
        # res = sorted(res, key=lambda i:i.path.upper())
        # cache.set(cache_key, res, 5)
        return dirs + files


    def exists(self, remote_path):
        response = self._send('HEAD', remote_path, (200, 301, 404))
        return True if response.status_code != 404 else False

    def move(self, remote_path, destination):
        res = self.session.request('MOVE', self.host + remote_path, headers={
            # 'Host': self.host,
            'Destination': self.host + destination
        })
        return res

    # deprecated
    def get_config_file(self, uri):
        conf_uri = os.path.splitext(uri)[0] + '.json'
        if not self.exists(conf_uri):
            fp = tempfile.TemporaryFile()
            fp.write(b'{}')
            fp.seek(0)
            self.upload(conf_uri, fp)
            fp.close()

        res, _ = self.open(conf_uri)
        return res

    # deprecated
    def save_config_file(self, uri, data):
        conf_uri = os.path.splitext(uri)[0] + '.json'
        with tempfile.TemporaryFile() as f:
            f.write(data.encode('utf8'))
            f.seek(0)
            self.upload(conf_uri, f)

        return conf_uri
