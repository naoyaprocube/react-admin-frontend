import * as React from 'react';
import {
  useTranslate,
  useRecordContext,
  useDataProvider,
} from 'react-admin'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { getClientIdentifier } from '../utils'
import { FireContext } from '../pages/ConnectionsList'

export const RMConnectionButton = (props: any) => {
  const { id } = props
  const { fire, setFire } = React.useContext(FireContext);
  const record = useRecordContext();
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