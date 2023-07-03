import React from 'react';
import {
  useNotify,
  Confirm,
  useDataProvider,
} from 'react-admin';
import { useWatch } from 'react-hook-form';
import Button from '@mui/material/Button';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useNavigate } from "react-router-dom";

let checkExist = false
let mongoid = ""
let checkSize = false

const FileSaveButton = (props: any) => {
  const [open, setOpen] = React.useState(false);
  const [isButton, setButton] = React.useState(false);
  const handleDialogClose = () => setOpen(false);
  const notify = useNotify();
  const file = useWatch({ name: 'file' });
  const dataProvider = useDataProvider();
  const navigate = useNavigate();

  const CheckExist = () => {
    return new Promise((resolve, reject) => {
      notify(`Checking file`, { type: 'info' });
      if (!file) {
        return
      }
      if (file.rawFile.size > 1024 * 1024 * 1024 * 1024) {
        notify(`File size over 1GB`, { type: 'error' })
        checkSize = true
        resolve("")
        return
      }
      dataProvider.check('files', file).then((response: any) => {
        return response.json()
      }).then((data: any) => {
        checkSize = (data.totalSize + file.rawFile.size > 1024 * 1024 * 1024 * 1024)
        if (checkSize === true) {
          notify(`Total file size over 2GB` + `Already filled ` + data.totalSize, { type: 'error' })
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
              notify(`Uploading file`, { type: 'info' })
              dataProvider.create('files', { "data": { "file": file } }).then(() => {
                setOpen(false)
                notify(`Uploaded`, { type: 'success' })
                navigate('/files')
              })
            }
          })
        }}
      >upload</Button>
      <Confirm
        isOpen={open}
        title={`This file already exists`}
        content="A file with the same name already exists. Are you sure you want to update this file?"
        onConfirm={() => {
          setButton(true)
          notify(`Uploading file`, { type: 'info' })
          setOpen(false)
          dataProvider.recreate('files', {
            "id": mongoid ,
            "data": { "file": file } 
          }).then(() => {
          // dataProvider.delete('files', { "id": mongoid })
          // dataProvider.create('files', { "data": { "file": file } }).then(() => {
            notify(`Uploaded`, { type: 'success' })
            navigate('/files')
          })

        }}
        onClose={handleDialogClose}
      />
    </>
  );
};

export default FileSaveButton;