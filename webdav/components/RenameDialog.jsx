/**
 * 文件或目录重命名
 */
import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { DirectoryContext } from './directory-context'
import { pathname } from './utils'


export default function RenameDialog({file, open, onSuccess, onClose}) {
  const [form, setForm] = useState({})
  const [error, setError] = useState(null)

  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setForm({ ...form, [name]: value })
  }

  useEffect(()=>{
    if(!open) {
      setForm({})
      setError(null)
    }
  }, [open])

  useEffect(() => {
    if(open) {
      setForm({name: pathname(file[1])})
      console.log(file[1])
    }
  }, [file, open])


  const handleSubmit = async (directory, forceRefresh) => {
    const url = `/api/${window.root}/webdav/move/`
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        body: JSON.stringify({ uri: file[1], destination:directory + form.name })
      })
      if(!res.ok) {
        throw res.status
      }
      onSuccess()
      forceRefresh()
    } catch(err) {
      console.error(err)
    }
  }

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      onClose={onClose}>
      <DialogTitle>重命名</DialogTitle>
      <DialogContent>
        {error && <Alert sx={{mb:2}} severity="error">{error}</Alert>}
        <TextField
          autoFocus
          label="新名称"
          name="name"
          fullWidth
          variant="standard"
          value={form.name ? form.name : ''}
          onChange={handleChange}
          helperText="请勿包含空格等特殊字符, 长度不大于20字符"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <DirectoryContext.Consumer>
          {({current, forceRefresh}) => (
            <Button 
              disabled={form.name ? undefined : true}
              onClick={()=>handleSubmit(current, forceRefresh)}
            >保存</Button>
          )}
        </DirectoryContext.Consumer>
      </DialogActions>
    </Dialog>
  )
}
