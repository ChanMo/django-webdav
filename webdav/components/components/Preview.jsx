/**
 * 文件预览
 */
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
} from '@mui/material';
import FilePreview from './FilePreview';
import Sidebar from './Sidebar';
import { pathname } from './../utils/utils';


export default function PreviewDialog({file, open, onClose}) {
  return (
    <Dialog 
      fullWidth
      maxWidth="lg"
      open={open} 
      onClose={onClose}>
      <DialogTitle>{pathname(file[1])}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <FilePreview file={file} />
          </Grid>
          <Grid item xs={4}>
            <Sidebar data={file} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {/*<Button onClick={()=>null}>下载</Button>*/}
        <Button onClick={onClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  );
}
