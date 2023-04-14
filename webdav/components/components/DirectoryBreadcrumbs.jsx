/**
 * 当前文件目录导航
 */
import React from 'react';
import {
  Breadcrumbs,
  Typography,
  Link
} from '@mui/material';
import { useDirectory } from './../context/directory-context';
import { pathname } from './../utils/utils';


export default function DirectoryBreadcrumbs() {
  const {current, setDir} = useDirectory();
  const path = current === '/' ? [''] : current.split('/').slice(0,-2);
  console.log(path);
  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      {path.map((item, index) => (
        <Link
          key={index.toString()}
          underline="hover"
          color="inherit"
          onClick={() => setDir(path.slice(0, index + 1).join('/') + '/')}
        >{item === '' ? '根目录' : item}</Link>
      ))}
      <Typography color="text.primary">
        {pathname(current)}
      </Typography>
    </Breadcrumbs>
  );
}
