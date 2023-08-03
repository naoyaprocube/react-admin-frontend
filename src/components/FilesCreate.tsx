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
import { Box } from '@mui/material';
import { blue } from '@mui/material/colors';
import { estimatedUploadTime } from './utils'

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
    const uploadLimit = process.env.REACT_APP_UPLOAD_LIMIT ? Number(process.env.REACT_APP_UPLOAD_LIMIT) : 1099511627776
    const uploadSpeed = process.env.REACT_APP_UPLOAD_SPEED ? Number(process.env.REACT_APP_UPLOAD_SPEED) : 33554432
    const uploadTime = estimatedUploadTime(file.rawFile.size, uploadLimit, uploadSpeed)
    let result = translate('file.info_sizeover')
    if(uploadTime.check) result = String(uploadTime.est) + translate(uploadTime.label)
    const scanLimit = process.env.REACT_APP_SCAN_LIMIT ? Number(process.env.REACT_APP_SCAN_LIMIT) : 4294967296
    const scanSpeed = process.env.REACT_APP_SCAN_SPEED ? Number(process.env.REACT_APP_SCAN_SPEED) : 429916
    const scanTime = estimatedUploadTime(file.rawFile.size, scanLimit, scanSpeed)
    let scan_result = translate('file.info_scan_sizeover')
    if(scanTime.check) scan_result = String(scanTime.est) + translate(scanTime.label)
    return (
      <Box sx={{ border: 1, color: '#ffffff', bgcolor: blue[400], width:1, p:2,  borderRadius: '16px',boxShadow: 3  }}>
        {translate('file.info')}
        <Box sx={{ p: 1, color: '#ffffff'}}>
          {translate('resources.root.fields.filename')}: {file.title}
        </Box>
        <Box sx={{ p: 1, color: '#ffffff'}}>
          {translate('resources.root.fields.length')}: {file.rawFile.size}
        </Box>
        <Box sx={{ p: 1, color: '#ffffff' }}>
          {translate('resources.root.fields.fileType')}: {file.rawFile.type}
        </Box>
        <Box sx={{ p: 1, color: '#ffffff' }}>
          {translate('resources.root.fields.uploadTime')}: {result}
        </Box>
        <Box sx={{ p: 1, color: '#ffffff' }}>
          {translate('resources.root.fields.scanTime')}: {scan_result}
        </Box>
      </Box>
    )
  }
  return null
}

const FilesCreate = (props: any) => {
  const translate = useTranslate()
  return (
    <Create {...props} redirect='/root' title={translate('file.uploadPageTitle')}>
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
            "onDropAccepted": (root) => {

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
