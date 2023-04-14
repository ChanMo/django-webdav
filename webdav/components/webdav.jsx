/**
 * 文件管理
 * UI参考Dropbox, NextCloud
 */

import React, { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import Cookies from 'js-cookie'

import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

// import Topbar from './components/Topbar'
import LeftPanel from './components/LeftPanel'
import DavBody from './components/DavBody.jsx'

import DirectoryProvider from './context/directory-context'
import BatchProvider from './context/batch'

export default function App(props) {
  return (
    <DirectoryProvider initial={props.current}>
      <React.Fragment>
        {/* <Topbar /> */}
        <Container maxWidth={false}>
          <Grid container>
            <Grid item sx={{ width: 240 }}>
              <LeftPanel
                sx={{ position: 'sticky', top: 68.5 }}
              />
            </Grid>
            <Grid item xs>
              <BatchProvider>
                <DavBody />
              </BatchProvider>
            </Grid>
          </Grid>
        </Container>
      </React.Fragment>
    </DirectoryProvider>
  )
}

createRoot(document.getElementById("innerApp")).render(
  <React.StrictMode>
    <App {...window.props} />
  </React.StrictMode>
);
