/**
 * 预览文件内容, 如图片, 文本等
 */
import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'


export default function FilePreview({file}) {
  if(file[5].match('^image\/')) {
    return (
      <Box sx={{display:'flex',justifyContent:'center'}}>
        <Box 
          component="img" 
          src={`/api/${window.root}/webdav/preview/?uri=${file[1]}`}
        />
      </Box>
    )
  } else if (file[5].match('^audio\/')) {
    return (
      <audio controls>
        <source src={`/api/${window.root}/webdav/preview/?uri=${file[1]}`} />
      </audio>
    )
  } else if (file[5].match('^video\/')) {
    return (
      <video controls>
        <source src={`/api/${window.root}/webdav/preview/?uri=${file[1]}`} />
      </video>
    )
  } else if (file[1].match('\.h5$')) {
    const [data, setData] = useState({})
    const fetchData = async() => {
      const url = `/api/${window.root}/webdav/preview/?uri=${file[1]}`
      const res = await fetch(url)
      const resJson = await res.json()
      setData(resJson)
    }
    useEffect(()=>{
      fetchData()
    }, [file])
    return (
      <Typography variant="body1">{JSON.stringify(data)}</Typography>
    )
  } else if (file[5] === 'application/json') {
    const [data, setData] = useState('')
    const fetchData = async() => {
      const url = `/api/${window.root}/webdav/preview/?uri=${file[1]}`
      const res = await fetch(url)
      const resText = await res.text()
      setData(resText)
    }
    useEffect(()=>{
      fetchData()
    }, [file])
    return (
      <Typography variant="body1">{data}</Typography>
    )
  } else {
    return (
      <Typography 
        variant="body1" 
        color="textSecondary"
      >文件不支持预览</Typography>
    )
  }
}
