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
import { Box } from '@mui/system'
import { Checkbox, Grid } from '@mui/material'
import { BatchContext } from './context/batch'


function FilesTable({ refreshCount, current, rank, list, changeList }) {
  const [data, setData] = useState([])
  useEffect(() => {
    fetchData()
  }, [current, refreshCount])
  useEffect(() => {
    changeList([])
  }, [current])

  const fetchData = async () => {
    const url = `/api/webdav/?dir=${current}`
    const res = await fetch(url)
    const resJson = await res.json()
    setData(resJson)
  }

  if (data.length <= 1) {
    return <Typography sx={{ py: 6, textAlign: 'center' }}>empty.</Typography>
  }
  const checkItem = (item) => {
    let result = []
    if (list.some(e => e === item[1])) {
      result = list.filter((row) => row !== item[1])
    } else {
      result = list.concat(item[1])
    }
    changeList(result)
  }
  const checkAll = () => {
    if (list.length !== data.slice(1).length) {
      changeList(data.slice(1).map((e) => e[1]))
    } else {
      changeList([])
    }
  }
  const renderTable = () => (
    <Table>
      <TableHead sx={{ position: 'sticky', top: 153, bgcolor: 'white', zIndex: 9 }}>
        <TableRow>
          <TableCell sx={{ p: 0 }}><Checkbox
            checked={list.length == data.slice(1).length}
            onClick={checkAll} /></TableCell>
          <TableCell>名称</TableCell>
          <TableCell>大小</TableCell>
          <TableCell>最后修改时间</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.slice(1).map((row, index) => (
          <TableRow hover key={index.toString()}>
            <TableCell sx={{ p: 0 }}>
              <Checkbox
                checked={list.some(e => e === row[1])}
                onClick={() => checkItem(row)} />
            </TableCell>
            <TableCell sx={{ p: 0 }}>
              <FileName file={row} />
            </TableCell>
            <TableCell>{row[5] !== 'httpd/unix-directory' ? formatBytes(row[2]) : ''}</TableCell>
            {/* FIXME */}
            <TableCell>{new Date(row[4]).toLocaleString()}</TableCell>
            <TableCell sx={{ py: 1 }}>
              <FileActions file={row} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
  const renderGrid = () => {
    return <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {data.slice(1).map((row, index) => (
        <Grid item key={index.toString()}>
          <Box sx={{
            width: 135,
            position: 'relative',
            '.actions': {
              display: 'none',
              position: 'absolute',
              right: 2,
              top: 2,
              borderRadius: '50%'
            },
            '.checkitem': {
              position: 'absolute',
              left: 2,
              top: 2,
              borderRadius: '50%'
            },
            '&:hover': {
              div: {
                bgcolor: '#f1f1f1',
                '.actions': { display: 'inline-flex' },
              },
            }
          }} >
            <Box sx={{
              p: 1,
            }}>
              <FileName file={row} direction={'column'} iconSize={75} />
              <Box className='actions'>
                <FileActions file={row} />
              </Box>
              <Box className='checkitem'>
                <Checkbox
                  checked={list.some(e => e === row[1])}
                  onClick={() => checkItem(row)} />
              </Box>
            </Box>
          </Box>
        </Grid>
      ))}
    </Box>
  }
  return <Box sx={{
    position: 'relative',
    marginTop: 1,
    minHeight: 20
  }}>
    {rank == 'table' ? renderTable() : renderGrid()}
  </Box>
}

export default ({ rank }) => (
  <DirectoryContext.Consumer>
    {(directoryContext) => (
      <BatchContext.Consumer>
        {(batchContext) => {
          return (
            <FilesTable {...directoryContext} {...batchContext} rank={rank} />
          )
        }}
      </BatchContext.Consumer>
    )}
  </DirectoryContext.Consumer>
)
