import * as React from 'react';
import {
  useTranslate,
  useDataProvider,
  useRecordContext,
} from 'react-admin'
import { Button, Typography } from '@mui/material';
import { FireContext } from '../pages/HistoryList'
import TvOffIcon from '@mui/icons-material/TvOff';

export const RMConnectionButton = (props: any) => {
  const { id, actives } = props
  const { fire, setFire } = React.useContext(FireContext);
  const record = useRecordContext();
  const dataProvider = useDataProvider()
  const translate = useTranslate()
  if(actives.indexOf(record.uuid) === -1) return null
  return (
    <Button
      variant="contained"
      sx={{ height: 20, ml: 0.3 }}
      color="error"
      startIcon={<TvOffIcon/>}
      onClick={() => {
        dataProvider.removeActive("connections", { id: record.uuid }).then(setFire(!fire))
      }}
    >
      <Typography component="pre" variant="body2">
        {translate('guacamole.disconnect')}
      </Typography>
    </Button>

  )
}