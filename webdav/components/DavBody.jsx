import React, { useState } from 'react'
import Cookies from 'js-cookie'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar'

import CreateFolderButton from './CreateFolderButton'
import UploadButton from './UploadButton'
import FilesTable from './FilesTable'
import DirectoryBreadcrumbs from './DirectoryBreadcrumbs'
import TableRowsIcon from '@mui/icons-material/TableRows';
import GridViewIcon from '@mui/icons-material/GridView';
import { DirectoryContext } from './directory-context'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'


export default function DavBody() {
  const [rank, setRank] = useState('grid')
  return (
    <DirectoryContext.Consumer>
      {({ current }) => (
        <Box sx={{ pl: 2 }}>
          <Box sx={{ pt: 3, position: 'sticky', top: 68.5, bgcolor: 'white', zIndex: 9 }}>
            <DirectoryBreadcrumbs />
            <Stack spacing={1} direction='row' sx={{ pb: 1 }}>
              <UploadButton />
              <CreateFolderButton />
              <Box sx={{ flex: 1 }}></Box>
              <ToggleButtonGroup
                size='small'
                value={rank}
                onChange={e => {
                  setRank(e.currentTarget.value)
                }}>
                <ToggleButton value='table'><TableRowsIcon /></ToggleButton>
                <ToggleButton value='grid'><GridViewIcon /></ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Box>
          <FilesTable rank={rank} />
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
