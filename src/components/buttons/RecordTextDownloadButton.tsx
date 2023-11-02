import * as React from 'react';
import {
  useTranslate,
  useRecordContext,
  useDataProvider,
  useNotify
} from 'react-admin'
import { Button, Typography, Modal, Box } from '@mui/material';
import { download, decodeUTF8 } from '../utils'
import TextFieldsIcon from '@mui/icons-material/TextFields';

export const RecordTextDownloadButton = (props: any) => {
  const notify = useNotify()
  const record = useRecordContext();
  const translate = useTranslate()
  const dataProvider = useDataProvider()
  // const array = JSON.parse(record.logs)
  const logs = Object.keys(record.logs).length !== 0 ?
    Object.entries(record.logs).map(([key, value]) => ({ key, value }))
    : null
  const filtered = logs ? logs.filter((v: any) => v.value.type === "TYPESCRIPT") : null
  const key = filtered && filtered.length > 0 ? filtered[0].key : null
  if (!key) return null
  return (
    <Button
      variant="contained"
      sx={{ height: 20, ml: 0.3 }}
      startIcon={<TextFieldsIcon/>}
      onClick={() => {
        dataProvider.download("history", { id: String(record.identifier), key: key }).then((response: Response) => {
          const filename = "record_" + String(record.identifier) + "_" + String(key) + ".log"
          if (response.status < 200 || response.status >= 300) {
            if (response.statusText) notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.statusText } })
            else notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: "Error" } })
          }
          else response.blob().then((blob: Blob) => download(blob, filename));
        }).catch((response: any) => {
          notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.message } })
        })
      }}
    >
      <Typography component="pre" variant="body2">
        {translate('guacamole.textlog')}
      </Typography>
    </Button>
  )
}