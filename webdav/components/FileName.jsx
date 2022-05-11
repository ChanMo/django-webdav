import React, { useState } from 'react'
import ButtonBase from '@mui/material/ButtonBase'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import FolderIcon from '@mui/icons-material/Folder';
import ImageIcon from '@mui/icons-material/Image';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import Preview from './Preview'
import { DirectoryContext } from './directory-context'
import { pathname } from './utils'


function FileName({file, setDir}) {
  const [open, setOpen] = useState(false) 

  const fileType = file[5]
  let icon = <FilePresentIcon color="action" />
  if(fileType === 'httpd/unix-directory') {
    icon = <FolderIcon color="info" />
  } else if (fileType.match('^image\/')) {
    icon = <ImageIcon color="action" />
  }

  const handleClick = () => {
    if(fileType === 'httpd/unix-directory') {
      setDir(file[1])
    } else {
      setOpen(true)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <ButtonBase 
        onClick={handleClick} 
        sx={{p:2,width:'100%',justifyContent:'flex-start'}}>
        <Stack direction="row" spacing={1}>
          {icon}
          <Typography>{pathname(file[1])}</Typography>
        </Stack>
      </ButtonBase>
      <Preview
        file={file}
        open={open}
        onClose={handleClose}
      />
    </>
  )
}

export default (props) => (
  <DirectoryContext.Consumer>
    {({setDir}) => (
      <FileName setDir={setDir} {...props} />
    )}
  </DirectoryContext.Consumer>
)
