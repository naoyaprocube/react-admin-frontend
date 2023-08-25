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
import { Box } from '@mui/material';
import { blue } from '@mui/material/colors';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BackButton } from '../buttons/BackButton'

const FileInfo = () => {
  const filename = useWatch({ name: 'filename' });
  const length = useWatch({ name: 'length' });
  const status = useWatch({ name: 'metadata.status' });
  const unique = useWatch({ name: 'metadata.unique' });
  const translate = useTranslate()
  return filename ? (
    <Box sx={{ mb: 2, bgcolor: blue[100], width: 1, p: 2, borderRadius: '16px', boxShadow: 1 }}>
      <Box>
        {translate('file.fields.length')}: {length}
      </Box>
      <Box>
        {translate('file.fields.metadata.status')}: {status}
      </Box>
      <Box>
        {translate('file.fields.metadata.unique')}: {unique}
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
  const { id, fileId } = useParams()
  
  const EditToolbar = () => {
    return (<Toolbar sx={{ display: "flex", justifyContent: 'space-between' }}>
      <BackButton dirId={id}/>
      <DeleteButton redirect={"/dirs/" + id} />
    </Toolbar >)
  }
  return (
    <Edit resource={id} id={fileId} redirect={"/dirs/" + id} actions={<EditToolbar />} title={<EditTitle />}>
      <SimpleForm toolbar={false}>
        <Box sx={{width:1, mb:2}}>
          <TextInput source="filename" label="file.fields.filename" variant="standard" sx={{ mb: -1, width:0.5, }} style={{maxWidth:600}} />
          <SaveButton size="small" sx={{ p:1, ml: 2, mt:2}} />
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
            <TextField source="Info" label="file.fields.Info" sortable={false} component="pre"/>
          </Datagrid>
        </ArrayField>
      </SimpleForm>
    </Edit>
  )
}
export default FileShow;