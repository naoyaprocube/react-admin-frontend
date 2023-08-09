import React from 'react';
import {
  useNotify,
  Confirm,
  useDataProvider,
  useTranslate,
  Toolbar,
} from 'react-admin';
import { useWatch } from 'react-hook-form';
import {
  Button,
  CircularProgress,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import dayjs from 'dayjs';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useNavigate } from "react-router-dom";
import { humanFileSize } from './utils'
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

let checkExist = false
let mongoid = ""
let checkSize = false


const FileToolbar = (props:any) => {
  const {dirId} = props
  const [open, setOpen] = React.useState(false);
  const [isButton, setButton] = React.useState(false);
  const [isUploading, setUploading] = React.useState(false);
  const [timestamp, setTimestamp] = React.useState('');
  const [elapsedTime, setElapsedTime] = React.useState('');
  const handleDialogClose = () => setOpen(false);
  const notify = useNotify();
  const file = useWatch({ name: 'file' });
  const dataProvider = useDataProvider();
  const navigate = useNavigate();
  const translate = useTranslate();

  const increment = () => {
    const time = dayjs().format('YYYY-MM-DDTHH:mm:ss');
    setTimestamp(time);
  };

  React.useEffect(() => {
    if (timestamp !== '') {
      const interval = setInterval(() => {
        const now = dayjs().format('YYYY-MM-DDTHH:mm:ss');
        const diffHour = (String(dayjs(now).diff(dayjs(timestamp), 'hour')).length > 1) ?
          String(dayjs(now).diff(dayjs(timestamp), 'hour')) :
          "0" + String(dayjs(now).diff(dayjs(timestamp), 'hour'));
        const diffMin = "0" + String(dayjs(now).diff(dayjs(timestamp), 'minute') % 60);
        const diffSec = "0" + String(dayjs(now).diff(dayjs(timestamp), 'second') % 60);
        setElapsedTime(diffHour + ":" + diffMin.slice(-2) + ":" + diffSec.slice(-2));
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
    else setElapsedTime("00:00:00");
  }, [timestamp]);

  React.useEffect(() => {
    const handler = (event: any) => {
      event.preventDefault();
      event.returnValue = '';
    };
    if (isUploading) {
      window.addEventListener('beforeunload', handler);
      return () => {
        window.removeEventListener('beforeunload', handler);
      };
    }
    return () => { };
  }, [isUploading]);

  const CheckExist = () => {
    return new Promise((resolve, reject) => {
      notify('file.check', { type: 'info' });
      if (!file) {
        return
      }
      dataProvider.check(dirId, file).then((response: any) => {
        if (response.status < 200 || response.status >= 300) {
          notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.statusText } })
        }
        return response.json()
      }).then((data: any) => {
        if (file.rawFile.size > data.sizeLimit) {
          notify('file.sizeover', { type: 'error', messageArgs: { fileSize: humanFileSize(file.rawFile.size, false), sizeLimit: humanFileSize(data.sizeLimit, false) } })
          checkSize = true
          resolve("")
        }
        else if (data.totalSize + file.rawFile.size > data.totalSizeLimit) {
          notify('file.totalSizeover', { type: 'error', messageArgs: { totalSize: humanFileSize(data.totalSize, false), totalSizeLimit: humanFileSize(data.totalSizeLimit, false) } })
          checkSize = true
          resolve("")
        }
        else if (data.existCheck === true && checkSize === false) {
          mongoid = data.id
          checkExist = data.existCheck
          setOpen(true);
          resolve("")
        }
        else {
          checkExist = false
          setOpen(false)
          resolve("")
        };
      })
    })
  };

  const onClick = () => CheckExist().then(() => {
    if (checkExist === false && checkSize === false) {
      setButton(true)
      setUploading(true)
      increment()
      // notify('file.uploading', { type: 'info', autoHideDuration: 24 * 60 * 60 * 1000, messageArgs: { filename: file.title } })
      dataProvider.create(dirId, { "data": { "file": file } }).then((response: any) => {
        console.log(response)
        if (response.data.res) {
          const res = response.data.res
          if (res.status < 200 || res.status >= 300) {
            notify('file.statusCodeError', { type: 'error', messageArgs: { code: res.status, text: res.statusText } })
            navigate("/dirs/" + dirId)
          }
          else if (res.status !== 202) {
            setOpen(false)
            setUploading(false)
            notify('file.uploaded', { type: 'success', messageArgs: { filename: file.title } })
            navigate("/dirs/" + dirId)
          }
        }
        else {
          setOpen(false)
          setUploading(false)
          notify('file.uploaded', { type: 'success', messageArgs: { filename: file.title } })
          navigate("/dirs/" + dirId)
        }
      })
    }
  })

  const onConfirm = () => {
    setButton(true)
    setUploading(true)
    increment()
    // notify('file.uploading', { type: 'info', autoHideDuration: 24 * 60 * 60 * 1000, messageArgs: { filename: file.title } })
    setOpen(false)
    dataProvider.recreate(dirId, {
      "id": mongoid,
      "data": { "file": file }
    }).then((response: any) => {
      if (response.status < 200 || response.status >= 300) {
        console.log(response)
        notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.statusText } })
      }
      else if (response.status !== 202) {
        setUploading(false)
        notify('file.uploaded', { type: 'success', messageArgs: { filename: file.title } })
        navigate("/dirs/" + dirId)
      }
    })
  }
  return (
    <Toolbar sx={{ flexDirection: 'row-reverse' }}>
      <Button
        startIcon={!isUploading && < FileUploadIcon />}
        variant="contained"
        disabled={!(file && !isButton)}
        onClick={onClick}
      >{translate('file.upload')}{isUploading && <CircularProgress size={20} color="inherit" sx={{ ml: 2 }} />}</Button>
      <Confirm
        isOpen={open}
        title='file.alreadyExist.title'
        content='file.alreadyExist.content'
        onConfirm={onConfirm}
        onClose={handleDialogClose}
      />
      <Dialog
        open={isUploading}
        PaperComponent={PaperComponent}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.25)'
          },
          '& .MuiPaper-root': {
            border: 0.5,
            mt: 30
          },
        }}
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          {translate('file.uploading', { filename: file ? file.title : null })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {translate('file.uploading_time')} : {elapsedTime}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              dataProvider.cancel(dirId, { filename: file ? file.title : null }).then((response: any) => {
                if (response.status < 200 || response.status >= 300) {
                  notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.statusText } })
                }
                else if (response.status === 200) {
                  notify('file.uploading_cancel', { type: 'info' });
                  setUploading(false)
                  navigate("/dirs/" + dirId)
                }
                else if (response.status === 202) {
                  notify('file.uploading_cancel_denied', { type: 'info' });
                }
              })
            }}>
            {translate('ra.action.cancel')}
          </Button>
        </DialogActions>
        <LinearProgress />
      </Dialog>
    </Toolbar>
  );
};

export default FileToolbar;