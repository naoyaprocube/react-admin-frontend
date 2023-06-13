import React from 'react';
import {
  Create,
  SimpleForm,
  FileField,
  FileInput,
  Toolbar,
} from 'react-admin';
import FileSaveButton from './FileSaveButton'

const FileToolbar = () => (
  <Toolbar sx={{ flexDirection: 'row-reverse' }}>
    <FileSaveButton />
  </Toolbar>
);

const FilesCreate = (props: any) => {
  return (
    <Create {...props} redirect='/files' title="Upload File">
      <SimpleForm toolbar={<FileToolbar />}>
        <FileInput source="file">
          <FileField source="src" title="title" />
        </FileInput>
      </SimpleForm>
    </Create>
  );
};

export default FilesCreate;
