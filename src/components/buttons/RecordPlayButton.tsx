import * as React from 'react';
import {
  useTranslate,
  useRecordContext,
  useDataProvider,
} from 'react-admin'
import { Button, Typography, Modal, Box } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export const RecordPlayButton = (props: any) => {
  const [open, setOpen] = React.useState(false);
  const record = useRecordContext();
  const translate = useTranslate()
  const dataProvider = useDataProvider()
  // const array = JSON.parse(record.logs)
  const logs = Object.keys(record.logs).length !== 0 ?
    Object.entries(record.logs).map(([key, value]) => ({ key, value }))
    : null
  const filtered = logs ? logs.filter((v: any) => v.value.type === "GUACAMOLE_SESSION_RECORDING") : null
  const key = filtered && filtered.length > 0 ? filtered[0].key : null
  if (!key) return null
  return (
    <Button
      variant="contained"
      sx={{ height: 20, m: 0.3 }}
      startIcon={<PlayArrowIcon/>}
      onClick={() => {
        dataProvider.getenv("files", {}).then(({ json }: any) => {
          setOpen(!open)
          window.open(json.guacUrl + "/#/settings/postgresql/recording/" + record.identifier + "/" + key, key)
        })
      }}
    >
      <Typography component="pre" variant="body2">
        {translate('guacamole.play')}
      </Typography>
    </Button>
  )
}