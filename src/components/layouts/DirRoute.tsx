import * as React from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
} from '@mui/material';

export const DirRoute = (props: any) => {
  const { dir } = props
  const fullpath = dir.fullpath
  const route = fullpath.slice(1,-1).map((d: string) => {
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
      {route}
      <Typography color="text.primary">{dir.dirname}</Typography>
    </Breadcrumbs>
  </Box>
}

