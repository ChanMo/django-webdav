/**
 * Demo reactView jsx file
 */
import React from 'react'
import {createRoot} from 'react-dom/client'
import Button from '@mui/material/Button'


function App() {
  return (
    <h1>ReactView</h1>
  )
}

const container = document.getElementById("app")
const root = createRoot(container)
root.render(
  <App {...window.props} />
)
