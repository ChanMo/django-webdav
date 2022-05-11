import xml.etree.ElementTree as ET
from django.test import TestCase
from . import get_webdav_client


class DavTest(TestCase):
    def test_tree(self):
        r = get_webdav_client().collection_tree('/8')
        if r.status_code != 207:
            print(r.text)
            
        self.assertEqual(r.status_code, 207)
        
        res = ET.fromstring(r.text)
        for href in res.iter('{DAV:}href'):
            print(href.text)

        # res = ET.dump(res)
