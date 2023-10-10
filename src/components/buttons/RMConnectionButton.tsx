import * as React from 'react';
import {
  useTranslate,
  useDataProvider,
} from 'react-admin'
import { Button, Typography } from '@mui/material';
import { FireContext } from '../pages/ConnectionsList'

export const RMConnectionButton = (props: any) => {
  const { id } = props
  const { fire, setFire } = React.useContext(FireContext);
  const dataProvider = useDataProvider()
  const translate = useTranslate()
  return (
    <Button
      variant="contained"
      sx={{ height: 20, m: 0.3 }}
      color="error"
      onClick={() => {
        dataProvider.removeActive("connections", { id: id }).then(setFire(!fire))
      }}
    >
      <Typography component="pre" variant="body2">
        {translate('guacamole.disconnect')}
      </Typography>
    </Button>

  )
}