import React, { useState } from 'react'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import RenameDialog from './RenameDialog'


export default function RenameMenu({file, onSuccess}) {
  const [open, setOpen] = useState(false)
  const handleClick = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleSuccess = () => {
    setOpen(false)
    onSuccess()
  }
  return (
    <>
      <MenuItem onClick={handleClick}>
        <ListItemIcon>
          <DriveFileRenameOutlineIcon fontSize="small" />
        </ListItemIcon>
        重命名
      </MenuItem>
      <RenameDialog 
        file={file}
        open={open} 
        onSuccess={handleSuccess}
        onClose={handleClose}
      />
    </>
  )
}
