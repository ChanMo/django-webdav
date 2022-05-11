import React from 'react'
import Cookies from 'js-cookie'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar'

import CreateFolderButton from './CreateFolderButton'
import UploadButton from './UploadButton'
import FilesTable from './FilesTable'
import DirectoryBreadcrumbs from './DirectoryBreadcrumbs'

import { DirectoryContext } from './directory-context'


export default function DavBody() {
  return (
    <DirectoryContext.Consumer>
      {({current}) => (

        <Box sx={{pl:2}}>
          <Box sx={{pt:3,position:'sticky',top:68.5,bgcolor:'white',zIndex:9}}>
            <DirectoryBreadcrumbs />
            <Stack spacing={1} direction='row' sx={{ pb: 1 }}>
              <UploadButton />
              <CreateFolderButton />
            </Stack>
          </Box>
          <FilesTable />
          {/*}
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={Boolean(msg)}
            autoHideDuration={5000}
            onClose={() => setMsg(null)}
            message={msg}
            />
            */}
        </Box>
      )}
    </DirectoryContext.Consumer>
  )
}
