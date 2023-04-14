import React from 'react'
import { Card, CardHeader, CardContent, Box, Typography } from '@mui/material'


export default function CommentLine({data, ...props}) {
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
          {data.message}
        </Typography>
      </CardContent>
    </Card>
  )
}
