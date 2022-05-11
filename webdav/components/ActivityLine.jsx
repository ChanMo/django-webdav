import React from 'react'
import { Card, CardHeader, CardContent, Box, Typography } from '@mui/material'

const actions = {
  'comment': '评论',
  'mv': '重命名',
  'upload_file': '上传文件'
}

export default function ActivityLine({data, ...props}) {
  return (
    <Card variant="outlined" {...props}>
      <CardHeader 
        title={data.user.username}
        titleTypographyProps={{variant:'body1'}}
        subheader={data.created_at}
        subheaderTypographyProps={{variant:'body2'}}
      />
      <CardContent sx={{py:0}}>
        <Typography
          noWrap={false}
          variant="body2" 
          color="text.secondary">
          {actions[data.action]}
        </Typography>
      </CardContent>
    </Card>
  )
}
