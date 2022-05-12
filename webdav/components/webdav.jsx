/**
 * 文件管理
 * UI参考Dropbox, NextCloud
 */

import React, { useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import Cookies from 'js-cookie'

import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

import Topbar from './Topbar'
import LeftPanel from './LeftPanel'
import DavBody from './DavBody.jsx'

import DirectoryProvider from './directory-context'

export default function App(props) {
  return (
    <DirectoryProvider initial={props.current}>
      <React.Fragment>
        <Topbar />
        <Container maxWidth={false}>
          <Grid container>
            <Grid item sx={{width: 240}}>
              <LeftPanel
                sx={{position: 'sticky',top:68.5}}
              />
            </Grid>
            <Grid item xs>
              <DavBody />
            </Grid>
          </Grid>
        </Container>
      </React.Fragment>
    </DirectoryProvider>
  )
}


ReactDOM.render(
  <React.StrictMode>
    <App {...window.props} />
  </React.StrictMode>,
  document.getElementById("app")
)
