import * as React from 'react';
import {
  Create,
  SimpleForm,
  FileInput,
  TextField,
  useTranslate,
  useDataProvider,
  Toolbar,
  useNotify,
} from 'react-admin';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { UploadButton } from '../buttons/UploadButton'
import { estimatedUploadTime } from '../utils'
import DeleteIcon from '@mui/icons-material/Delete';
import { useWatch } from 'react-hook-form';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
  const notify = useNotify()
  const dataProvider = useDataProvider()
  const [envs, setEnvs] = React.useState({
    isScan: false,
    scanLimit: 4294967296,
    scanSpeed: 429916,
    totalSizeLimit: 1099511627776,
    uploadLimit: 1099511627776,
    uploadSpeed: 33554432,
  });
  React.useEffect(() => {
    dataProvider.getenv("files").then((result: any) => {
      setEnvs(result.json)
    }).catch((response: any) => {
      notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.message } })
    })
  }, [])
  if (file) {
    const uploadTime = estimatedUploadTime(file.rawFile.size, envs.uploadLimit, envs.uploadSpeed)
    let result = translate('file.info_sizeover')
    if (uploadTime.check) result = String(uploadTime.est) + translate(uploadTime.label)
    const scanTime = estimatedUploadTime(file.rawFile.size, envs.scanLimit, envs.scanSpeed)
    let scan_result = translate('file.info_scan_sizeover')
    if (scanTime.check) scan_result = String(scanTime.est) + translate(scanTime.label)
    return (
      <Box sx={{ border: 1, color: "primary.contrastText", bgcolor: "primary.dark", width: 1, p: 2, borderRadius: '16px', boxShadow: 3 }}>
        {translate('file.info')}
        <Box sx={{ p: 1, color: '#ffffff' }}>
          {translate('file.fields.filename')}: {file.title}
        </Box>
        <Box sx={{ p: 1, color: '#ffffff' }}>
          {translate('file.fields.length')}: {file.rawFile.size}
        </Box>
        <Box sx={{ p: 1, color: '#ffffff' }}>
          {translate('file.fields.fileType')}: {file.rawFile.type}
        </Box>
        <Box sx={{ p: 1, color: '#ffffff' }}>
          {translate('file.fields.uploadTime')}: {result}
        </Box>
        {envs.isScan ? <Box sx={{ p: 1, color: '#ffffff' }}>
          {translate('file.fields.scanTime')}: {scan_result}
        </Box> : null}
      </Box>
    )
  }
  return null
}

const FilesCreate = (props: any) => {
  const translate = useTranslate()
  const { workId, dirId } = useParams()
  const navigate = useNavigate()
  const FileToolbar = () => (
    <Toolbar sx={{ flexDirection: 'row-reverse' }}>
      <UploadButton workId={workId} dirId={dirId} />
    </Toolbar>
  )
  return (<>
    <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 2 }}>
      <Link
        underline="hover"
        color="inherit"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        {translate('pages.workSelect')}
      </Link>
      {workId === "public" ?
        <Link
          underline="hover"
          color="inherit"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/files/public' + "/" + dirId)}
        >
          {translate('pages.publicFileManager')}
        </Link>
        : <Link
          underline="hover"
          color="inherit"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/files/' + workId + "/" + dirId)}
        >
          {translate('pages.fileManager')}
        </Link>
      }
      <Typography color="text.primary">
        {translate('pages.fileUpload')}
      </Typography>
    </Breadcrumbs>
    <Create {...props} resource={workId + "." + dirId} redirect={"/files/" + dirId} title={translate('file.uploadPageTitle')}>
      <SimpleForm toolbar={<FileToolbar />}>
        <FileInput
          source="file"
          removeIcon={DeleteIcon}
          label={"file.upload"}
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
  </>

  );
};

export default FilesCreate;
