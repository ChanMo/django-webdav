import React from 'react'
import Cookies from 'js-cookie'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { DirectoryContext } from './directory-context'

export default function FileDeleteDialog(props) {
  const { file, open, onClose, onDelete } = props
  const handleSubmit = async (forceRefresh) => {
    const url = `/api/webdav/delete/`
    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        body: JSON.stringify({ uri: file[1] })
      })
      if(!res.ok) {
        throw res.status
      }
      forceRefresh()
      onDelete()
    } catch(err) {
      console.error(err)
    }
  }

  return (
    <DirectoryContext.Consumer>
      {({forceRefresh}) => (
        <Dialog
          open={open}
          fullWidth
          maxWidth="sm"
          onClose={onClose}>
          <DialogTitle>确定删除?</DialogTitle>
          <DialogContent>
            <DialogContentText>删除后无法恢复, 请谨慎操作</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>取消</Button>
            <Button color="error" onClick={()=>handleSubmit(forceRefresh)}>删除</Button>
          </DialogActions>
        </Dialog>
      )}
    </DirectoryContext.Consumer>
  )
}
