/**
 * 文件预览页面右侧
 */
import React, { useState } from 'react';

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

//import CommentBox from './CommentBox'
import FileSummary from './FileSummary';
//import ActivityBox from './ActivityBox'
//import ShareBox from './ShareBox'


const menus = [
  {label:'信息',name:'summary'},
  // {label:'活动',name:'activity'},
  // {label:'评论',name:'comment'},
  // {label:'分享',name:'share'},
]

export default function Sidebar({data, ...props}) {
  const [active, setActive] = useState(0);

  const renderItem = (menu) => {
    if(menu === 'summary') {
      return <FileSummary data={data} />;
    // } else if (menu === 'activity') {
    //   return <ActivityBox resource={data[1]} />
    // } else if (menu === 'comment') {
    //   return <CommentBox resource={data[1]} />
    // } else if (menu === 'share') {
    //   return <ShareBox resource={data[1]} />
    } else {
      return null;
    }
  };
  return (
    <Box {...props}>
      {menus.map((menu,index) => (
        <Accordion 
          key={index.toString()}
          onChange={()=>setActive(index)}
          expanded={active === index}>
          <AccordionSummary
            id={`file-sidebar-${index}`}
            aria-controls="file-sidebar">
            <Typography>{menu.label}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderItem(menu.name)}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}
