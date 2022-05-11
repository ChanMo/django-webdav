import React, { useState, useEffect } from 'react'
import { Card, CardContent, Typography, Stack, Button, Box, OutlinedInput } from '@mui/material'
import Cookies from 'js-cookie'
import Empty from '../../components/Empty'
import CommentLine from './CommentLine'


export default function CommentBox({resource}) {
  const [data, setData] = useState([])
  const [form, setForm] = useState({})

  useEffect(() => {
    fetchData()
  }, [resource])

  const fetchData = async () => {
    const url = `/api/${window.root}/webdav/comment/?resource=${resource}`
    try {
      const res = await fetch(url)
      if(!res.ok) {
        throw res.status
      }
      const resJson = await res.json()
      setData(resJson.results)
    } catch(err) {
      console.error(err)
    }
  }

  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setForm({...form, [name]:value})
  }

  const handleSubmit = async () => {
    const url = `/api/${window.root}/webdav/comment/`
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        body: JSON.stringify({
          ...form,
          resource: resource
        })
      })
      if(!res.ok) {
        throw res.status
      }
      fetchData()
      setForm({})
    } catch(err) {
      console.error(err)
    }
  }


  const renderForm = () => (
    <Stack direction="row" spacing={1}>
      <OutlinedInput 
        multiline
        size="small"
        fullWidth 
        name="message" 
        value={form.message ? form.message : ''}
        onChange={handleChange}
        placeholder="请输入评论信息" />
      <Button 
        disabled={!Boolean(form.message)}
        onClick={handleSubmit}
        variant="contained" 
        size="small">
        Send
      </Button>
    </Stack>
  )

  return (
    <Stack spacing={1}>
      <Box sx={{maxHeight:'40vh',overflowY: 'auto' }}>
        {data.length ? data.map(row => 
          <CommentLine 
            data={row} 
            key={row.id.toString()}
            sx={{mb:1}}
          />
        ) : (
          <Empty text='暂无评论'></Empty>
        )}
      </Box>
      {renderForm()}
    </Stack>
  )
}
