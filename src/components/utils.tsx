import {
  useNotify,
  useRecordContext,
  useDataProvider
} from 'react-admin';
import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const DownloadButton = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  if (!record) return null;
  return <Button color="primary" sx={{ display: 'inline-flex' }} startIcon={< FileDownloadIcon />} onClick={() => {
    notify(`file.downloading`, { type: 'info', autoHideDuration: 24 * 60 * 60 * 1000, messageArgs: { filename: record.filename } })
    dataProvider.download('files', { "id": record.id }).then((response: any) => {
      console.log(response)
      if (response.status < 200 || response.status >= 300) {
        notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.statusText } })
      }
      return response
    })
  }}></Button>;
};
const humanFileSize = (bytes: any, si = false, dp = 1) => {
  const thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }
  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  return bytes.toFixed(dp) + ' ' + units[u];
}

const estimatedUploadTime = (bytes: number,limit: number = 1024 * 1024 * 1024 * 1024, speed: number = 32 * 1024 * 1024) => {
  let check = true
  if(bytes > limit) check = false
  const time = Math.floor(bytes / speed)
  const sec = time % 60
  const min = Math.floor(time / 60) % 60
  const hour = Math.floor(time / (60*60))
  let label = 'file.sec'
  let est = 0
  if (sec === 0 && min === 0 && hour === 0) {
    label = 'file.sec'
    est = 1
  }
  else if (min === 0 && hour === 0) {
    label = 'file.sec'
    est = sec
  }
  else if (min > 0 && hour === 0) {
    label = 'file.min'
    est = min
  }
  else if (hour > 0) {
    label = 'file.hour'
    est = hour
  }
  return { check, sec, min, hour, label, est }
}

export { DownloadButton, humanFileSize, estimatedUploadTime }