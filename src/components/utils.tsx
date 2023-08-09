import * as React from 'react';
import {
  useNotify,
  useRecordContext,
  useDataProvider,
  useTranslate,
  useRefresh
} from 'react-admin';
import {
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import { FireContext } from './Dirmenu'

const DownloadButton = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  if (!record) return null;
  return <Button color="primary" sx={{ display: 'inline-flex' }} startIcon={< FileDownloadIcon />} size="small" onClick={() => {
    notify(`file.downloading`, { type: 'info', autoHideDuration: 24 * 60 * 60 * 1000, messageArgs: { filename: record.filename } })
    dataProvider.download('root', { "id": record.id }).then((response: any) => {
      console.log(response)
      if (response.status < 200 || response.status >= 300) {
        notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.statusText } })
      }
      return response
    })
  }} />;
};

const NameInputField = ({ control }: any) => {
  const translate = useTranslate()
  return (
    <div>
      <Controller
        control={control}
        name="NameInputField"
        defaultValue={""}
        render={({ field: { onChange, value } }) => (
          <TextField
            autoFocus
            margin="dense"
            id="dirname"
            fullWidth
            variant="standard"
            value={value}
            onChange={onChange}
            InputLabelProps={{ shrink: true }}
          />
        )}
      />
    </div>
  );
};
interface MKDProps {
  sidebarIsOpen: boolean;
  dirId: String;
  dirName: String;
}
const MKDirButton = (props: MKDProps) => {
  const { sidebarIsOpen, dirId, dirName } = props;
  const { control, handleSubmit } = useForm({
    mode: "onChange"
  });
  const [open, setOpen] = React.useState(false);
  const { fire, setFire } = React.useContext(FireContext);
  const dataProvider = useDataProvider()
  const translate = useTranslate()
  const onCancel = () => setOpen(false)
  const onSubmit = (data: any) => {
    dataProvider.mkdir(dirId, { dirname: data.NameInputField }).then(() => {
      setFire(fire => !fire)
    })
  }
  return (
    <>
      <IconButton
        color="primary"
        onClick={() => setOpen(true)}
        children={<CreateNewFolderIcon />}
        size="small"
      />
      <Dialog
        open={open}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.25)'
          }
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogTitle>
            {translate('dir.mkdir.title')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {translate('dir.mkdir.context', {name: dirName})}
            </DialogContentText>
            <NameInputField control={control} />
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              onClick={() => {
                setOpen(false);
              }}
            >
              {translate('dir.create')}
            </Button>
            <Button
            color="inherit"
              onClick={onCancel}
            >
              {translate('ra.action.cancel')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

interface RDBProps {
  isRoot: boolean;
  mongoid: string;
}
const RemoveDirButton = (props: RDBProps) => {
  const { mongoid, isRoot } = props;
  const { fire, setFire } = React.useContext(FireContext);
  const refresh = useRefresh();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  if (!isRoot) return null
  const removeHandle = () => dataProvider.rmdir({ id: mongoid }).then((result: any) => {
    setFire(fire => !fire)
  })
  return <IconButton
    color="error"
    children={<DeleteIcon />}
    size="small"
    onClick={removeHandle}
  />
}

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

const estimatedUploadTime = (bytes: number, limit: number = 1024 * 1024 * 1024 * 1024, speed: number = 32 * 1024 * 1024) => {
  let check = true
  if (bytes > limit) check = false
  const time = Math.floor(bytes / speed)
  const sec = time % 60
  const min = Math.floor(time / 60) % 60
  const hour = Math.floor(time / (60 * 60))
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

export { DownloadButton, MKDirButton, RemoveDirButton, humanFileSize, estimatedUploadTime }