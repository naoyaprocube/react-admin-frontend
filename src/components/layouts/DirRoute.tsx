import * as React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
} from '@mui/material';

export const DirRoute = (props: any) => {
  const { dir, isMongo } = props
  const fullpath = dir.fullpath
  const start = isMongo ? 1 : 0
  const route = fullpath.slice(start, -1).map((d: string) => {
    return (<Typography color="text.primary">
      {d}
    </Typography>)
  })
  return <Box
    sx={{
      display: 'flex',
      flexDirection: 'row',
      width: 1
    }}
    style={{ textTransform: 'none' }}
  >
    <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 2 }}>
      <Box />
      {route}
      <Typography color="text.primary">{dir.dirname}</Typography>
    </Breadcrumbs>
  </Box>
}

