import React, { useState } from 'react';
import {
  Box,
  Stack,
} from '@mui/material';
import CreateFolderButton from './CreateFolderButton';
import UploadButton from './UploadButton';
import FilesTable from './FilesTable';
import DirectoryBreadcrumbs from './DirectoryBreadcrumbs';
//import TableRowsIcon from '@mui/icons-material/TableRows';
//import GridViewIcon from '@mui/icons-material/GridView';
import { useDirectory } from './../context/directory-context';
//import { ToggleButton, ToggleButtonGroup } from '@mui/material'
//import BatchButton from './BatchButton'


export default function DavBody() {
  //const [rank, setRank] = useState('table');
  const {current} = useDirectory();
  return (
    <Box sx={{ pl: 2 }}>
      <Box sx={{ pt: 3, position: 'sticky', top: 68.5, bgcolor: 'white', zIndex: 9 }}>
        <DirectoryBreadcrumbs />
        <Stack spacing={1} direction='row' sx={{ pb: 1 }}>
          <UploadButton />
          <CreateFolderButton />
          {/* <BatchButton /> */}
          {/* <Box sx={{ flex: 1 }}></Box> */}
          {/* <ToggleButtonGroup */}
          {/*   size='small' */}
          {/*   value={rank} */}
          {/*   sx={{ 'button': { p: '5px' } }} */}
          {/*   onChange={e => { */}
          {/*     setRank(e.currentTarget.value) */}
          {/*   }}> */}
          {/*   <ToggleButton value='table'><TableRowsIcon /></ToggleButton> */}
          {/*   <ToggleButton value='grid'><GridViewIcon /></ToggleButton> */}
          {/* </ToggleButtonGroup> */}
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
  );
}
