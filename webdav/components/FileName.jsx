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
import { Box } from '@mui/system';


function FileName({ file, setDir, direction = 'row', iconSize = 24 }) {
  const [open, setOpen] = useState(false)
  const fileType = file[5]
  let icon = <FilePresentIcon color="action" fontSize='inherit' />
  if (fileType === 'httpd/unix-directory') {
    icon = <FolderIcon color="info" fontSize='inherit' />
  } else if (fileType.match('^image\/')) {
    icon = <ImageIcon color="action" fontSize='inherit' />
  }

  const handleClick = () => {
    if (fileType === 'httpd/unix-directory') {
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
        sx={{
          p: 2,
          position: 'relative',
          width: '100%',
          justifyContent: direction === 'row' ? 'flex-start' : 'center'
        }}>
        <Stack direction={direction}
          width='100%'
          alignItems='center'
          fontSize={iconSize} spacing={1}>
          {icon}
          <Typography sx={{
            width: direction === 'row' ? 'auto' : '100%',
            overflow: "hidden",
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>{pathname(file[1])}</Typography>
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
    {({ setDir }) => (
      <FileName setDir={setDir} {...props} />
    )}
  </DirectoryContext.Consumer>
)
