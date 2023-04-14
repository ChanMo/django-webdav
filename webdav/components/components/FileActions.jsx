import React, { useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider'
import MoreVertIcon from '@mui/icons-material/MoreVert';

import DownloadMenu from './DownloadMenu'
import RenameMenu from './RenameMenu'
import FileDeleteMenu from './FileDeleteMenu'
import { pathname } from './../utils/utils'

export default function FileActions({file}) {
  const fullpath = file[1]
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <React.Fragment>
      <Tooltip title="更多">
        <IconButton
          id={`${fullpath}-button`}
          aria-controls={open ? `${fullpath}-menu` : undefined}
          aria-expanded={open ? 'true': undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id={`${fullpath}-menu`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{'aria-labelledby': `${fullpath}-button`}}
        PaperProps={{
          style: {
            width: '200px'
          }
        }}
      >
        <MenuItem 
          sx={{'cursor':'initial','&:hover':{'bgcolor':'inherit'}}}
        >{pathname(file[1])}</MenuItem>
        <Divider />
        <DownloadMenu file={file} />
        <RenameMenu file={file} onSuccess={handleClose} />
        <FileDeleteMenu file={file} onClose={handleClose} />
      </Menu>
    </React.Fragment>
  )
}
