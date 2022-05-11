import React, { useState } from 'react' 
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import CreateFolderDialog from './CreateFolderDialog'


export default function CreateFolderButton() {
  const [open, setOpen] = useState(false)
  const handleClose = () => {
    setOpen(false)
  }
  const handleClick = () => {
    setOpen(true)
  }
  return (
    <>
      <Button
        onClick={handleClick}
        startIcon={<AddIcon />}
        variant="outlined">
        创建目录
      </Button>
      <CreateFolderDialog 
        open={open}
        onClose={handleClose}
      />
    </>
  )
}
