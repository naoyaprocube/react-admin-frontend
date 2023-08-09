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
import {useParams} from "react-router-dom";

const FileInfo = () => {
  const filename = useWatch({ name: 'filename' });
  const length = useWatch({ name: 'length' });
  const status = useWatch({ name: 'metadata.status' });
  const translate = useTranslate()
  return filename ? (<Box sx={{ mb:2, bgcolor: blue[200], width: 1, p: 2, borderRadius: '16px', boxShadow: 1 }}>
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
  const {id,fileId} = useParams()
  return (
    <Edit resource={id} id={fileId} actions={false} title={<EditTitle />}>
      <SimpleForm >
        <TextInput source="filename" label="file.fields.filename" variant="standard" sx={{mb:-1}}/>
        <FileInfo />
        <Box>
          {translate('file.fields.metadata.accessHistory')}
        </Box>
        <ArrayField source="metadata.accessHistory" label="file.fields.metadata.accessHistory">
          <Datagrid bulkActionButtons={false} sx={{
            width: 1, 
            '& .RaDatagrid-headerCell': {
              backgroundColor: blue[200],
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