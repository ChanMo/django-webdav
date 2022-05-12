/**
 * 文件的列表展示
 * TODO Grid展示
 * TODO 自定义排序
 * TODO 图片预览
 */
import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

import FileName from './FileName'
import FileActions from './FileActions'

import { DirectoryContext } from './directory-context'
import { formatBytes } from './utils'


function FilesTable({refreshCount, current}) {
  const [data, setData] = useState([])
  useEffect(() => {
    fetchData()
  }, [current, refreshCount])

  const fetchData = async () => {
    const url = `/api/webdav/?dir=${current}`
    const res = await fetch(url)
    const resJson = await res.json()
    setData(resJson)
  }

  if(data.length <= 1) {
    return <Typography sx={{py:6,textAlign:'center'}}>empty.</Typography>
  }

  return (
    <Table>
      <TableHead sx={{position:'sticky',top:153,bgcolor:'white',zIndex:9}}>
        <TableRow>
          <TableCell>名称</TableCell>
          <TableCell>大小</TableCell>
          <TableCell>最后修改时间</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.slice(1).map((row, index) => (
          <TableRow hover key={index.toString()}>
            <TableCell sx={{p:0}}>
              <FileName file={row} />
            </TableCell>
            <TableCell>{row[5] !== 'httpd/unix-directory' ? formatBytes(row[2]) : ''}</TableCell>
            {/* FIXME */}
            <TableCell>{new Date(row[4]).toLocaleString()}</TableCell>
            <TableCell sx={{py:1}}>
              <FileActions file={row} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default () => (
  <DirectoryContext.Consumer>
    {(context) => (
      <FilesTable {...context} />
    )}
  </DirectoryContext.Consumer>
)
