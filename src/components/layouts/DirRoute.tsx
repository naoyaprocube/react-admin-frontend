import * as React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

export const DirRoute = (props: any) => {
  const { dir } = props
  const route = dir.fullpath.map((d: string) => {
    return <>
      <KeyboardArrowRightIcon sx={{}}/>
      <Typography
        children={d}
      />
    </>
  })
  return <Box
    children={route}
    sx={{
      display: 'flex',
      flexDirection: 'row',
      width: 1
    }}
    style={{ textTransform: 'none' }}
  />
}

