import React from 'react';
import {
  Create,
  SimpleForm,
  FileInput,
  TextField,
  useTranslate
} from 'react-admin';
import FileToolbar from './FileToolbar'
import DeleteIcon from '@mui/icons-material/Delete';
import { useWatch } from 'react-hook-form';
import Box from '@mui/material/Box';
import { blue } from '@mui/material/colors';
import { estimatedUploadTime } from '../utils'

const DropzoneDisplay = () => {
  const file = useWatch({ name: 'file' });
  if (file) {
    return 'none'
  }
  return 'inline'
}

const FilePreview = () => {
  const file = useWatch({ name: 'file' });
  const translate = useTranslate()
  if (file) {
    console.log(file)
    const time = estimatedUploadTime(file.rawFile.size)
    return (
      <Box sx={{ border: 1, color: 'text.primary', bgcolor: blue[200] , width:1,p:2,  borderRadius: '16px'  }}>
        {translate('file.info')}
        <Box sx={{ p: 1, color: 'text.secondary'}}>
          {translate('resources.files.fields.filename')}:{file.title}
        </Box>
        <Box sx={{ p: 1, color: 'text.secondary'}}>
          {translate('resources.files.fields.length')}:{file.rawFile.size}
        </Box>
        <Box sx={{ p: 1, color: 'text.secondary' }}>
          {translate('resources.files.fields.fileType')}:{file.rawFile.type}
        </Box>
        <Box sx={{ p: 1, color: 'text.secondary' }}>
          {translate('file.uploadTime')}:{time.hour}:{time.min}:{time.sec}
        </Box>
      </Box>
    )
  }
  return null
}

const FilesCreate = (props: any) => {
  return (
    <Create {...props} redirect='/files' title="Upload File">
      <SimpleForm toolbar={<FileToolbar />}>
        <FileInput
          source="file"
          removeIcon={DeleteIcon}
          sx={{
            '& .RaFileInput-dropZone': {
              display: DropzoneDisplay
            },
            '& .previews': {
            },
          }}
          options={{
            "onDropAccepted": (files) => {

            }
          }}>
          <TextField source="title" />
        </FileInput>
        <FilePreview />
      </SimpleForm>
    </Create>
  );
};

export default FilesCreate;
