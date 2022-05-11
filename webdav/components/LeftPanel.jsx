/**
 * 文件管理左侧Panel
 * FIXME 删除后NodeID混乱
 */
import React, { useState, useEffect, useImperativeHandle } from 'react'
import Box from '@mui/material/Box'
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography'

import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { DirectoryContext } from './directory-context'
import { pathname } from './utils'



function LeftPanel(props) {
  const {refreshCount, setDir, ...other} = props

  const [data, setData] = useState([])

  const fetchData = async () => {
    const url = `/api/${window.root}/webdav/tree/`
    try {
      const res = await fetch(url)
      if(!res.ok) {
        throw res.status
      }
      const resJson = await res.json()
      setData(resJson)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [refreshCount])

  const handleSelect = (event, nodeId) => {
    let id = parseInt(nodeId)
    let res = data
    if(id === 0) {
      res = data[0]
    } else {
      let level = parseInt(Math.log(id) / Math.log(100))
      while (level >= 0) {
        let index = id
        if (level > 0) {
          index = parseInt(id / Math.pow(100, level))
        }
        id = id % Math.pow(100, level)
        level -= 1
        if (Array.isArray(res)) {
          res = res[index]
        } else {
          res = res.children[index-1]
        }
      }
    }
    return setDir(res.path)
  }

  const renderTree = (nodes, level=0) => (
    <TreeItem 
      key={nodes.path} 
      nodeId={level.toString()} 
      label={
        <Box sx={{display:'flex',alignItems:'center'}}>
          <FolderOutlinedIcon 
            fontSize="small"
            color="action" 
            sx={{mr:.5}} />
          <Typography variant="body1">{pathname(nodes.path)}</Typography>
        </Box>
      }>
        {Array.isArray(nodes.children) && nodes.children.length > 0
          ? nodes.children.map((node, index) => renderTree(
            node, level*100+index+1))
          : null}
        </TreeItem>
  )
  return (
    <Box sx={[{pt:3,pl:2},other.sx]}>
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        onNodeSelect={handleSelect}
      >
        {data.map((node, index) => renderTree(node, index))}
      </TreeView>
    </Box>
  )
}

export default (props) => (
  <DirectoryContext.Consumer>
    {({refreshCount, setDir}) => (
      <LeftPanel {...props} refreshCount={refreshCount} setDir={setDir} />
    )}
  </DirectoryContext.Consumer>
)
