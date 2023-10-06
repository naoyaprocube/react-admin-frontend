import * as React from 'react';
import {
  useTranslate,
  useRecordContext
} from 'react-admin'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { getClientIdentifier } from '../utils'
import { FireContext } from '../pages/ConnectionsList'

export const ConnectButton = (props: any) => {
  const { id, type } = props
  const { fire, setFire } = React.useContext(FireContext);
  const record = useRecordContext();
  const translate = useTranslate()
  const identifier = id ? getClientIdentifier(id, type) : getClientIdentifier(record.identifier, type)
  return (
    <Button
      variant="contained"
      sx={{ height: 20, m: 0.3 }}
      onClick={() => {
        setFire(!fire)
        window.open("http://localhost:8080/#/client/" + identifier, "_blank", "noreferrer")
      }}
    >
      <Typography component="pre" variant="body2">
        {translate('guacamole.connect')}
      </Typography>

    </Button>

  )
}