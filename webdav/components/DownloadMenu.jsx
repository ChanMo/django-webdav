import React from 'react'
import Cookies from 'js-cookie'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';


export default function DownloadMenu({file}) {
  if(file[5] === 'httpd/unix-directory') {
    return null
  }

  const handleClick = () => {
    window.location.href = `/api/${window.root}/webdav/open/?uri=${file[1]}`
  }

  return (
    <MenuItem onClick={handleClick}>
      <ListItemIcon>
        <DownloadOutlinedIcon fontSize="small" />
      </ListItemIcon>
      下载
    </MenuItem>

  )
}
