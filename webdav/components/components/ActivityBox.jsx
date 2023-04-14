/**
 * File Activity Log
 */
import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
//import Empty from '../../components/Empty'
import ActivityLine from './ActivityLine'


export default function ActivityBox({resource}) {
  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
  }, [resource])

  const fetchData = async () => {
    const url = `/api/webdav/activity/?resource=${resource}`
    const res = await fetch(url)
    const resJson = await res.json()
    setData(resJson.results)
  }

  if (data.length <= 0) {
    return <Typography>Empty</Typography>
  }

  return (
    <Box sx={{maxHeight:'40vh',overflow:'auto'}}>
      {data.map(row => (
        <ActivityLine 
          data={row} 
          key={row.id.toString()}
          sx={{mb:1}}
        />
      ))}
    </Box>
  )
}
