import {
  ArrayField,
  DateField,
  Datagrid,
  Edit,
  SimpleForm,
  TextField,
  TextInput,
  useTranslate,
  useRecordContext,
  SaveButton,
} from 'react-admin';
import { useWatch } from 'react-hook-form';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const FileInfo = () => {
  const filename = useWatch({ name: 'filename' });
  const length = useWatch({ name: 'length' });
  const status = useWatch({ name: 'metadata.status' });
  const unique = useWatch({ name: 'metadata.unique' });
  const path = unique.split("/")
  path.shift()
  path.shift()
  const uniqueStr = "/" + path.join("/")
  const translate = useTranslate()
  return filename ? (
    <Box sx={{ mb: 2, bgcolor: "primary.light", color: "primary.contrastText", p: 2, borderRadius: '16px', boxShadow: 1 }}>
      <Typography variant="body2">
        {translate('file.fields.length')}: {length}
      </Typography>
      <Typography variant="body2">
        {translate('file.fields.metadata.status')}: {status}
      </Typography>
      <Typography variant="body2">
        {translate('file.fields.metadata.unique')}: {uniqueStr}
      </Typography>
    </Box>
  ) : null
};
const EditTitle = () => {
  const record = useRecordContext();
  return <span>{record ? `"${record.filename}"` : ''}</span>;
};

const FileShow = (props: any) => {
  const translate = useTranslate()
  const { workId, dirId, fileId } = useParams()
  const navigate = useNavigate()
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
          onClick={() => navigate('/files/public/' + dirId)}
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
        {translate('pages.fileInfo')}
      </Typography>
    </Breadcrumbs>
    <Edit resource={"files"} id={fileId} queryOptions={{ meta: { dirId: dirId } }} redirect={"/files/" + workId + "/" + dirId} title={<EditTitle />}>
      <SimpleForm toolbar={false}>
        <Box sx={{ width: 1, mb: 1 }}>
          <TextInput source="filename" label="file.fields.filename" variant="standard" sx={{ mb: -1, width: 0.5, }} style={{ maxWidth: 600 }} />
          <SaveButton size="small" sx={{ p: 1, ml: 2, mt: 2 }} />
        </Box>
        <FileInfo />
        <Box>
          {translate('file.fields.metadata.accessHistory')}
        </Box>
        <ArrayField source="metadata.accessHistory" label="file.fields.metadata.accessHistory">
          <Datagrid bulkActionButtons={false} sx={{
            width: 1,
            '& .RaDatagrid-headerCell': {
              backgroundColor: "primary.light",
              color: "primary.contrastText"
            },
          }}>
            <TextField source="Type" label="file.fields.Type" sortable={false} />
            <DateField source="Date" label="file.fields.Date" showTime locales="jp-JP" sortable={false} />
            <TextField source="Protocol" label="file.fields.Protocol" sortable={false} />
            <TextField source="SourceIP" label="file.fields.SourceIP" sortable={false} />
            <TextField source="Info" label="file.fields.Info" sortable={false} component="pre" />
          </Datagrid>
        </ArrayField>
      </SimpleForm>
    </Edit>
  </>

  )
}
export default FileShow;