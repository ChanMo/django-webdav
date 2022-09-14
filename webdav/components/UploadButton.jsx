import React from 'react'
import Cookies from 'js-cookie'
import Button from '@mui/material/Button'
import Input from '@mui/material/Input'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { DirectoryContext } from './directory-context'


export default function UploadButton() {
  const handleUpload = async (event, directory, forceRefresh) => {
    const f = event.target.files[0]
    //setMsg(`${f.name}上传中`)
    const url = `/api/webdav/upload/`
    let formData = new FormData()
    formData.append('file', f)
    formData.append('uri', directory)
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        //'Content-Type': 'multipart/form-data',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
      mode: 'same-origin',
      body: formData
    })
    const resJson = await res.json()
    forceRefresh()
    //setMsg(`${f.name}上传成功`)
  }

  return (
    <DirectoryContext.Consumer>
      {({ current, forceRefresh }) => (
        <label htmlFor="upload-file">
          <Input
            onChange={(event) => handleUpload(event, current, forceRefresh)}
            id="upload-file"
            type="file"
            sx={{ display: 'none' }} />
          <Button
            component="span"
            startIcon={<FileUploadIcon />}
            variant="contained"
          >上传文件</Button>
        </label>
      )}
    </DirectoryContext.Consumer>
  )
}
