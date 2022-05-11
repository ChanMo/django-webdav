import React, { useState } from 'react'
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import FileDeleteDialog from './FileDeleteDialog'

export default function FileDeleteMenu({file, onClose}) {
  const [open, setOpen] = useState(false)
  const handleDelete = () => {
    setOpen(false)
    onClose()
  }
  return (
    <>
      <MenuItem onClick={()=>setOpen(true)}>
        <ListItemIcon>
          <DeleteOutlinedIcon fontSize="small" />
        </ListItemIcon>
        删除
      </MenuItem>
      <FileDeleteDialog
        file={file}
        open={open}
        onClose={()=>setOpen(false)}
        onDelete={handleDelete}
      />
    </>
  )
}
