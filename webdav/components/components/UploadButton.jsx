/**
 * Upload Files
 */
import React from 'react';
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useDirectory } from './../context/directory-context';


export default function UploadButton() {
  const { current, forceRefresh } = useDirectory();
  
  const handleUpload = async (event, directory, forceRefresh) => {
    const f = event.target.files[0];
    //setMsg(`${f.name}上传中`)
    const url = `/api/webdav/upload/`;
    let formData = new FormData();
    formData.append('file', f);
    formData.append('uri', directory);
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        //'Content-Type': 'multipart/form-data',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
      mode: 'same-origin',
      body: formData
    });
    if(res.ok) {
      forceRefresh();
    }
    //const resJson = await res.json();
    //setMsg(`${f.name}上传成功`)
  };

  return (
    <label htmlFor="upload-file">
      <Input
        onChange={(event) => handleUpload(event, current, forceRefresh)}
        id="upload-file"
        type="file"
        inputProps={{
          //accept:".geojson,.shp,.zip"
        }}
        sx={{ display: 'none' }} />
      <Button
        component="span"
        startIcon={<FileUploadIcon />}
        variant="contained"
      >上传文件</Button>
    </label>
  );
}
