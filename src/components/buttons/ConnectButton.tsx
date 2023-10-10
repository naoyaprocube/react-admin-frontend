import * as React from 'react';
import {
  useTranslate,
  useRecordContext
} from 'react-admin'
import { Button, Typography } from '@mui/material';
import { getClientIdentifier } from '../utils'
import { FireContext } from '../pages/ConnectionsList'

export const ConnectButton = (props: any) => {
  const { id, type, workId } = props
  const { fire, setFire } = React.useContext(FireContext);
  const record = useRecordContext();
  const translate = useTranslate()
  const identifier = id ? getClientIdentifier(id, type, workId) : getClientIdentifier(record.identifier, type, workId)
  
  return (
    <Button
      variant="contained"
      sx={{ height: 20, m: 0.3 }}
      onClick={() => {
        setFire(!fire)
        window.open("http://localhost:8080/#/client/" + identifier, "admingate")
      }}
    >
      <Typography component="pre" variant="body2">
        {translate('guacamole.connect')}
      </Typography>

    </Button>

  )
}