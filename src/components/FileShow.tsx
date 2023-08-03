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
} from 'react-admin';
import { useWatch } from 'react-hook-form';
import { Box } from '@mui/material';
import { blue } from '@mui/material/colors';

const FileInfo = () => {
  const filename = useWatch({ name: 'filename' });
  const length = useWatch({ name: 'length' });
  const status = useWatch({ name: 'metadata.status' });
  const translate = useTranslate()
  return filename ? (<Box sx={{ mb:2, bgcolor: blue[200], width: 1, p: 2, borderRadius: '16px', boxShadow: 1 }}>
    <Box>
      {translate('resources.root.fields.length')}: {length}
    </Box>
    <Box>
      {translate('resources.root.fields.metadata.status')}: {status}
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
  return (
    <Edit actions={false} title={<EditTitle />}>
      <SimpleForm >
        <TextInput source="filename" variant="standard" sx={{mb:-1}}/>
        <FileInfo />
        <Box>
          {translate('resources.root.fields.metadata.accessHistory')}
        </Box>
        <ArrayField source="metadata.accessHistory">
          <Datagrid bulkActionButtons={false} sx={{
            width: 1, 
            '& .RaDatagrid-headerCell': {
              backgroundColor: blue[200],
            },
          }}>
            <TextField source="Type" sortable={false} />
            <DateField source="Date" showTime locales="jp-JP" sortable={false} />
            <TextField source="Protocol" sortable={false} />
            <TextField source="SourceIP" sortable={false} />
            <TextField source="Info" sortable={false} />
          </Datagrid>
        </ArrayField>
      </SimpleForm>
    </Edit>
  )
}
export default FileShow;