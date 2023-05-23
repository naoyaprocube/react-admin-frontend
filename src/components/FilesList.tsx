import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  FileField,
  useGetOne,
  useNotify,
  useRecordContext
} from 'react-admin';
import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Box from '@mui/material/Box';
// const { data: file, isLoading, error } = useGetOne(
//   'files',
//   { id: record._id },
// );
function download(blob:any, filename:any) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  // the filename you want
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

const DownloadButton = () => {
  const record = useRecordContext();
  const notify = useNotify();
  if (!record) return null;
  return <Button color="primary" startIcon={< FileDownloadIcon />} onClick={() => {
    console.log(record);
    const url = `http://localhost:3000/fileserver/api/files/${record.id}`
    fetch(url)
      .then(function (response) {
        notify(`Downloading file`, { type: 'info' });
        console.log(response)
        const filename = response.headers.get('Content-Disposition').split('=')[1];
        response.blob().then(blob => download(blob, filename))
      })
  }}></Button>;
};

const FilesList = (props:any) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="filename" label="File" />
        <TextField source="length" />
        <Box sx={{flexGrow: 1}}>
          <DownloadButton />
          <DeleteButton label="" mutationMode="pessimistic" />
        </Box>

        {/* <Button color="primary" onClick={GetFile}>Custom Action</Button> */}
        {/* <EditButton label="" icon=< FileDownloadIcon /> /> */}

      </Datagrid>
    </List>
  );
};

export default FilesList;