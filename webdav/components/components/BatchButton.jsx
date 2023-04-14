import React from 'react'
import Button from '@mui/material/Button'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { BatchContext } from './../context/batch';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

export default function BatchButton() {
  const handleDelete = async (list) => {
    console.log('delete', list)
  }
  const handleDownload = async () => {
    console.log('download', list)
  }

  return (
    <BatchContext.Consumer>
      {({ list }) => (
        list.length ? <>
          <Button
            component="span"
            startIcon={<DeleteIcon />}
            sx={{ mr: 1 }}
            color="error"
            onClick={() => handleDelete(list)}
            variant="outlined"
          >删除选中</Button>
          <Button
            component="span"
            startIcon={<DownloadIcon />}
            onClick={() => handleDownload(list)}
            variant="outlined"
          >下载选中</Button>
        </> : null
      )}
    </BatchContext.Consumer>
  )
}
