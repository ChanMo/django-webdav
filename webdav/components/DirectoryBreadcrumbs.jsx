import React from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { DirectoryContext } from './directory-context'
import { pathname } from './utils'


export default function DirectoryBreadcrumbs() {
  return (
    <DirectoryContext.Consumer>
      {({current, setDir}) => (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          {current && current.split('/').slice(0, -2).map((item, index) => (
            <Link
              key={index.toString()}
              underline="hover"
              color="inherit"
              onClick={()=>setDir(current.split('/').slice(0, index+1).join('/') + '/')}
            >{item === '' ? '首页' : item}</Link>
          ))}
          <Typography color="text.primary">
            {pathname(current)}
          </Typography>
        </Breadcrumbs>
      )}
    </DirectoryContext.Consumer>
    )
}
