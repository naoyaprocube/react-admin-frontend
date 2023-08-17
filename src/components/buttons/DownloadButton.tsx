import * as React from 'react';
import {
  useNotify,
  useRecordContext,
  useDataProvider,
} from 'react-admin';
import {
  Button,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const DownloadButton = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  if (!record) return null;
  return <Button color="primary" sx={{ display: 'inline-flex' }} startIcon={< FileDownloadIcon />} size={"small"} onClick={() => {
    notify(`file.downloading`, { type: 'info', messageArgs: { filename: record.filename } })
    dataProvider.download('root', { "id": record.id }).then((response: any) => {
      if (response.status < 200 || response.status >= 300) {
        notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.statusText } })
      }
      return response
    })
  }} />;
};
export default DownloadButton