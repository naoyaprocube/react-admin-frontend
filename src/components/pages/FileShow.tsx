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
  DeleteButton,
  Toolbar,
} from 'react-admin';
import { useWatch } from 'react-hook-form';
import { Box, Button } from '@mui/material';
import { blue } from '@mui/material/colors';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const FileInfo = () => {
  const filename = useWatch({ name: 'filename' });
  const length = useWatch({ name: 'length' });
  const status = useWatch({ name: 'metadata.status' });
  const translate = useTranslate()
  return filename ? (
    <Box sx={{ mb: 2, bgcolor: blue[100], width: 1, p: 2, borderRadius: '16px', boxShadow: 1 }}>
      <Box>
        {translate('file.fields.length')}: {length}
      </Box>
      <Box>
        {translate('file.fields.metadata.status')}: {status}
      </Box>
    </Box>
  ) : null
};
const EditTitle = () => {
  const record = useRecordContext();
  return <span>{record ? `"${record.filename}"` : ''}</span>;
};

const FileShow = (props: any) => {
  const translate = useTranslate()
  const navigate = useNavigate()
  const { id, fileId } = useParams()
  const BackButton = () => {
    return (<Button
      startIcon={<ArrowBackIcon />}
      children={translate('ra.action.back')}
      size="small"
      onClick={() => navigate("/dirs/" + id)}
      color="inherit"
    />)
  }
  const EditToolbar = () => {
    return (<Toolbar sx={{display: "flex", justifyContent: 'space-between' }}>
      <BackButton />
      <DeleteButton redirect={"/dirs/" + id} />
    </Toolbar >)
  }
return (
  <Edit resource={id} id={fileId} redirect={"/dirs/" + id} actions={<EditToolbar />} title={<EditTitle />}>
    <SimpleForm toolbar={false}>
      <Box>
        <TextInput source="filename" label="file.fields.filename" variant="standard" sx={{ mb: -1 }} />
        <SaveButton sx={{ ml: 2, mt: 2 }} />
      </Box>
      <FileInfo />
      <Box>
        {translate('file.fields.metadata.accessHistory')}
      </Box>
      <ArrayField source="metadata.accessHistory" label="file.fields.metadata.accessHistory">
        <Datagrid bulkActionButtons={false} sx={{
          width: 1,
          '& .RaDatagrid-headerCell': {
            backgroundColor: blue[100],
          },
        }}>
          <TextField source="Type" label="file.fields.Type" sortable={false} />
          <DateField source="Date" label="file.fields.Date" showTime locales="jp-JP" sortable={false} />
          <TextField source="Protocol" label="file.fields.Protocol" sortable={false} />
          <TextField source="SourceIP" label="file.fields.SourceIP" sortable={false} />
          <TextField source="Info" label="file.fields.Info" sortable={false} />
        </Datagrid>
      </ArrayField>
    </SimpleForm>
  </Edit>
)
}
export default FileShow;