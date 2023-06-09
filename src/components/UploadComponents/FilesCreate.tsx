import React from 'react';
import {
  Create,
  SimpleForm,
  TextField,
  FileInput,
  Toolbar,
} from 'react-admin';
import FileSaveButton from './FileSaveButton'
import DeleteIcon from '@mui/icons-material/Delete';

const FileToolbar = () => (
  <Toolbar sx={{ flexDirection: 'row-reverse' }}>
    <FileSaveButton />
  </Toolbar>
);
// import { useRecordContext } from 'react-admin';
// const titleField = (props:any) => {
//     const record = useRecordContext(props);
//     return record ? <span>{record.attachments[0].title}</span> : null;
// }



const FilesCreate = (props: any) => {
  return (
    <Create {...props} redirect='/files' title="Upload File">
      <SimpleForm toolbar={<FileToolbar />}>
        <FileInput
          source="file"
          removeIcon={DeleteIcon}
          sx={{
            '& .previews': {
              alignSelf: 'flex-end',
            },
          }}>
          <TextField 
          source="title" 
          sx = {{
            fontSize:16
          }}
          />
        </FileInput>
      </SimpleForm>
    </Create>
  );
};

export default FilesCreate;
