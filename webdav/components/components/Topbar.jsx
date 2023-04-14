import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'


export default function Topbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{flexGrow:1}}
        >文件管理</Typography>
      </Toolbar>
    </AppBar>
  )
}
