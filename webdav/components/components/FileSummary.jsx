/**
 * File base info
 */
import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { formatBytes } from './../utils/utils'


export default function FileSummary({data, ...props}) {
  return (
    <Box>
      <Typography 
        gutterBottom 
        variant="body2" 
        color="text.secondary">
        文件路径: {data[1]}
      </Typography>
      <Typography 
        gutterBottom 
        variant="body2" 
        color="text.secondary">
        文件大小：{formatBytes(data[2])}
      </Typography>
      <Typography 
        gutterBottom 
        variant="body2" 
        color="text.secondary">
        上传时间：{new Date(data[3]).toLocaleString()}
      </Typography>
      <Typography 
        gutterBottom 
        variant="body2" 
        color="text.secondary">
        修改时间：{new Date(data[4]).toLocaleString()}
      </Typography>
    </Box>

  )
}
