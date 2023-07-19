import React from 'react';
import {
  useNotify,
  Confirm,
  useDataProvider,
  useTranslate
} from 'react-admin';
import { useWatch } from 'react-hook-form';
import Button from '@mui/material/Button';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useNavigate } from "react-router-dom";
import { humanFileSize } from '../utils'

let checkExist = false
let mongoid = ""
let checkSize = false


const FileSaveButton = (props: any) => {
  const [open, setOpen] = React.useState(false);
  const [isButton, setButton] = React.useState(false);
  const [isUploading, setUploading] = React.useState(false);
  const handleDialogClose = () => setOpen(false);
  const notify = useNotify();
  const file = useWatch({ name: 'file' });
  const dataProvider = useDataProvider();
  const navigate = useNavigate();
  const translate = useTranslate();
  React.useEffect(() => {
    const handler = (event:any) => {
      event.preventDefault();
      event.returnValue = '';
    };
    if (isUploading) {
      window.addEventListener('beforeunload', handler);
      return () => {
        window.removeEventListener('beforeunload', handler);
      };
    }
    return () => {};
  }, [isUploading]);
  const CheckExist = () => {
    return new Promise((resolve, reject) => {
      notify('file.check', { type: 'info' });
      const sizeLimit = 1024 * 1024 * 1024 * 1024
      const totalSizeLimit = 1024 * 1024 * 1024 * 1024
      if (!file) {
        return
      }
      if (file.rawFile.size > sizeLimit) {
        notify('file.sizeover', { type: 'error', messageArgs: { fileSize: humanFileSize(file.rawFile.size, false), sizeLimit: humanFileSize(sizeLimit, false) } })
        checkSize = true
        resolve("")
        return
      }
      dataProvider.check('files', file).then((response: any) => {
        return response.json()
      }).then((data: any) => {
        checkSize = (data.totalSize + file.rawFile.size > totalSizeLimit)
        if (checkSize === true) {
          notify('file.totalSizeover', { type: 'error', messageArgs: { totalSize: humanFileSize(data.totalSize, false), totalSizeLimit: humanFileSize(totalSizeLimit, false) } })
          resolve("")
        }
        else if (data.existCheck === true && checkSize === false) {
          mongoid = data.id
          checkExist = data.existCheck
          setOpen(true);
          resolve("")
        } else {
          checkExist = false
          setOpen(false)
          resolve("")
        };
      })
    })
  };
  return (
    <>
      <Button
        startIcon={< FileUploadIcon />}
        variant="contained"
        disabled={!(file && !isButton)}
        onClick={() => {
          CheckExist().then(() => {
            if (checkExist === false && checkSize === false) {
              setButton(true)
              setUploading(true)
              notify('file.uploading', { type: 'info', autoHideDuration: 24 * 60 * 60 * 1000, messageArgs: { filename: file.title } })
              dataProvider.create('files', { "data": { "file": file } }).then(() => {
                setOpen(false)
                setUploading(false)
                notify('file.uploaded', { type: 'success', messageArgs: { filename: file.title } })
                navigate('/files')
              })
            }
          })
        }}
      >{translate('ra.action.create')}</Button>
      <Confirm
        isOpen={open}
        title='file.alreadyExist.title'
        content='file.alreadyExist.content'
        onConfirm={() => {
          setButton(true)
          setUploading(true)
          notify('file.uploading', { type: 'info', autoHideDuration: 24 * 60 * 60 * 1000, messageArgs: { filename: file.title } })
          setOpen(false)
          dataProvider.recreate('files', {
            "id": mongoid,
            "data": { "file": file }
          }).then(() => {
            setUploading(false)
            notify('file.uploaded', { type: 'success', messageArgs: { filename: file.title } })
            navigate('/files')
          })

        }}
        onClose={handleDialogClose}
      />
    </>
  );
};

export default FileSaveButton;