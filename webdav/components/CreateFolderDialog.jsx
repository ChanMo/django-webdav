/**
 * 新建目录DialogForm
 */
import React, { useState, useEffect } from 'react'
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Cookies from 'js-cookie'
import { DirectoryContext } from './directory-context'


export default function CreateFolderDialog({ open, onClose }) {
  const [form, setForm] = useState({})
  const [error, setError] = useState(null)
  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setForm({ ...form, [name]: value })
  }
  useEffect(()=>{
    setForm({})
    setError(null)
  }, [open])

  const handleSubmit = async (direction, forceRefresh) => {
    const url = `/api/${window.root}/webdav/mkdir/`
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        body: JSON.stringify({name:direction+form.name})
      })
      if(!res.ok) {
        throw res.status
      }
      onClose()
      forceRefresh()
    } catch(err) {
      console.error(err)
      setError('创建失败, 请检查后重试')
    }
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
      <DialogTitle>创建文件夹</DialogTitle>
      <DialogContent>
        {error && <Alert sx={{mb:2}} severity="error">{error}</Alert>}
        <TextField
          autoFocus
          label="名称"
          name="name"
          fullWidth
          variant="standard"
          value={form.name ? form.name : ''}
          onChange={handleChange}
          helperText="目录名勿包含空格等特殊字符, 长度不大于20字符"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <DirectoryContext.Consumer>
          {({current, forceRefresh}) => (
            <Button 
              disabled={form.name ? undefined : true}
              onClick={()=>handleSubmit(current, forceRefresh)}
            >创建</Button>
          )}
        </DirectoryContext.Consumer>
      </DialogActions>
    </Dialog>
  )
}
