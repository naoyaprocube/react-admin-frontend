import React from 'react';
import {
  useNotify,
  Confirm,
  useDataProvider,
  useTranslate,
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
import { humanFileSize } from '../utils'
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

export const UploadButton = (props: any) => {
  const { dirId } = props
  const [open, setOpen] = React.useState(false);
  const [mongoid, setMongoId] = React.useState("");
  const [isButton, setButton] = React.useState(false);
  const [isUploading, setUploading] = React.useState(false);
  const [timestamp, setTimestamp] = React.useState('');
  const [elapsedTime, setElapsedTime] = React.useState('');

  const notify = useNotify();
  const file = useWatch({ name: 'file' });
  const dataProvider = useDataProvider();
  const navigate = useNavigate();
  const translate = useTranslate();

  const handleDialogClose = () => setOpen(false);

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

  const CheckExist = () => new Promise((resolve, reject) => {
    notify('file.check', { type: 'info' });
    if (!file) {
      return
    }
    dataProvider.check(dirId, file).then((response: any) => {
      if (response.status < 200 || response.status >= 300) {
        if(response.statusText) notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.statusText } })
        else notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: "Error" } })
      }
      return response.json()
    }).then((data: any) => {
      const ret = {
        checkSize: (file.rawFile.size > data.uploadLimit),
        checkTotalSize: (data.totalSize + file.rawFile.size > data.totalSizeLimit),
        checkExist: data.existCheck,
        mongoId: data.id,
      }
      if (ret.checkSize) notify('file.sizeover', { type: 'error', messageArgs: { fileSize: humanFileSize(file.rawFile.size, false), sizeLimit: humanFileSize(data.sizeLimit, false) } })
      else if (ret.checkTotalSize) notify('file.totalSizeover', { type: 'error', messageArgs: { totalSize: humanFileSize(data.totalSize, false), totalSizeLimit: humanFileSize(data.totalSizeLimit, false) } })
      else if (ret.checkExist) {
        setMongoId(ret.mongoId)
        setOpen(true)
      }
      resolve(ret)
    }).catch((response: any) => {
      notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.message } })
    })
  })

  const uploadFile = (id: string, isOverwrite: boolean) => {
    setButton(true)
    setUploading(true)
    increment()
    if (isOverwrite) setOpen(false)
    dataProvider.upload(dirId, { "id": id, "data": { "file": file } }).then((response: any) => {
      if (response.status < 200 || response.status >= 300) {
        notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.message } })
      }
      else if (response.status === 200) {
        setUploading(false)
        navigate("/files/" + dirId)
        notify('file.statusCodeError', { type: 'warning', messageArgs: { code: response.status, text: response.body } })
      }
      else if (response.status !== 202) {
        setUploading(false)
        notify('file.uploaded', { type: 'success', messageArgs: { filename: file.title } })
        navigate("/files/" + dirId)
      }
    })
    .catch((response: any) => {
      setUploading(false)
      navigate("/files/" + dirId)
      notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.message } })
    })
  }
  const onClick = () => CheckExist().then((ret: any) => {
    if (!ret.checkExist && !ret.checkSize && !ret.checkTotalSize) {
      uploadFile("new", false)
    }
  })

  const onConfirm = () => {
    uploadFile(mongoid, true)
  }

  return (
    <>
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
                  notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.message } })
                }
                else if (response.status === 200) {
                  notify('file.uploading_cancel', { type: 'info' });
                  setUploading(false)
                  navigate("/files/" + dirId)
                }
                else if (response.status === 202) {
                  notify('file.uploading_cancel_denied', { type: 'info' });
                }
              }).catch((response: any) => {
                notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.message } })
              })
            }}>
            {translate('ra.action.cancel')}
          </Button>
        </DialogActions>
        <LinearProgress />
      </Dialog>
    </>
  );
};
