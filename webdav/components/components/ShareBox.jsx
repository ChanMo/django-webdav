import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'


export default function ShareBox({resource, ...props}) {
  const [data, setData] = useState(null)
  const [form, setForm] = useState({})

  useEffect(() => {
    fetchData()
  }, [resource])

  const fetchData = async() => {
    const url = `/api/webdav/sharelink/?resource=${resource}`
    const res = await fetch(url)
    const resJson = await res.json()
    if(resJson.count) {
      setData(resJson.results[0])
      setForm(resJson.results[0])
    }
  }

  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setForm({...form, [name]:value})
  }

  const handleSubmit = async() => {
    if(data) {
      const url = `/api/webdav/sharelink/${data.uuid}/?resource=${resource}`
      try {
        const res = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken'),
          },
          body: JSON.stringify(form)
        })
      } catch(err) {
        console.error(err)
      }
    } else {
      const url = `/api/webdav/sharelink/`
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
      } catch(err) {
        console.error(err)
      }
    }
    fetchData()
  }

  const handleDelete = async() => {
    const url = `/api/webdav/sharelink/${data.uuid}/?resource=${resource}`
    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
      })
      if(!res.ok) {
        throw res.status
      }
      setForm({})
      setData(null)
    } catch(err) {
      console.error(err)
    }
  }


  return (
    <Stack spacing={2} {...props}>
      <TextField
        label="访问密码"
        name="password"
        value={form.password ? form.password : ''}
        onChange={handleChange}
      />
      {data && (
        <Typography 
          sx={{color:'success.main'}}>
          {data.link}
        </Typography>
      )}
      <Stack direction="row" spacing={1}>
        <Button 
          disabled={!Boolean(form.password)}
          onClick={handleSubmit}
          variant="contained">生成共享链接</Button>
          {data && (
            <Button 
              onClick={handleDelete}
              variant="outlined" 
              color="error">
              取消共享
            </Button>
          )}
        </Stack>
      </Stack>
  )
}
