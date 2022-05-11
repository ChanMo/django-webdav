/**
 * 文件管理
 * UI参考Dropbox, NextCloud
 */

import React, { useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import Cookies from 'js-cookie'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

import LeftPanel from './LeftPanel'
import DavBody from './DavBody.jsx'
import TopBar from '../../projects/components/TopBar'
import SettingDialog from '../../projects/components/SettingDialog'

import { updateSetting } from './utils'
import DirectoryProvider from './directory-context'

export default function App(props) {
  const [settingOpen, setSettingOpen] = useState(false)
  const [project, setProject] = useState(props.project)

  /*
   * save project settings
   */
  const handleUpdate = async(value) => {
    const res = await updateSetting(project, value)
    if(res) setProject(resJson)
    setSettingOpen(false)
  }


  return (
    <DirectoryProvider>
      <React.Fragment>
        <TopBar 
          project={project}
          onSettingClick={()=>setSettingOpen(true)}
        />
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
        <SettingDialog
          open={settingOpen}
          defaultValue={project}
          onClose={()=>setSettingOpen(false)}
          onChange={handleUpdate}
        />
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
