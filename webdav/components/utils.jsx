import Cookies from 'js-cookie'

// https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
export function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// get leaf name from fullpath
export const pathname = (fullpath) => {
  const paths = fullpath.split('/')
  if(paths[paths.length-1] === '') {
    return paths[paths.length-2]
  }
  return paths[paths.length-1]
}

/**
 * update project settings
 */
export const updateSetting = async(project, value) => {
  try {
    const url = `/api/@${project.org.slug}/${project.id}/setting/`
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Content-Type': 'application/json'
      },
      //mode: 'same-origin',
      body: JSON.stringify(value)
    })
    if(!res.ok) throw res.status
    const resJson = await res.json()
    return resJson
  } catch(err) {
    console.error(err)
    return null
  }

}
