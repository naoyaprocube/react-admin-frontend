import React from 'react';
import {
  Create,
  SimpleForm,
  SaveButton,
  FileField,
  FileInput,
  Toolbar,
  useNotify,
  Confirm,
  useDataProvider,
} from 'react-admin';
import { useWatch } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@mui/material/Button';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  file: yup.mixed().required("You need to provide a file")
    .test("fileSize", "The file is too large", (value: any) => {
      return value && value.rawFile.size <= 1024 * 1024 * 1024;
    })
})

let mongoid = ""
let checkExist = false

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
      const checkurl = `http://localhost:3000/fileserver/api/files/check`
      if(!file){
        
        return
      }
      const checkparams = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "filename": file.title })
      };
      fetch(checkurl, checkparams)
        .then(response => response.json())
        .then((data) => {
          if (data.existCheck === true) {
            mongoid = data.id
            console.log(mongoid)
            checkExist = data.existCheck
            setOpen(true);
            resolve("")
            console.log("inCheckExist:" + checkExist)
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
            console.log("inOnClick:" + checkExist)
            if (checkExist === false) {
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
          dataProvider.delete('files', { "id": mongoid })
          dataProvider.create('files', { "data": { "file": file } }).then(() => {
            notify(`Uploaded`, { type: 'success' })
            navigate('/files')
          })

        }}
        onClose={handleDialogClose}
      />
    </>
  );
};
const FileToolbar = () => (
  <Toolbar sx={{ flexDirection: 'row-reverse' }}>
    <FileSaveButton />
  </Toolbar>
);

const FilesCreate = (props: any) => {
  return (
    <Create {...props} redirect='/files' title="Upload File">
      <SimpleForm resolver={yupResolver(schema)} toolbar={<FileToolbar />}>
        <FileInput source="file">
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Create>
  );
};

export default FilesCreate;
