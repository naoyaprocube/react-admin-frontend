import {
  ArrayField,
  DateField,
  Datagrid,
  Edit,
  SimpleForm,
  TextField,
  TextInput,
} from 'react-admin';
import { blue } from '@mui/material/colors';
const FileShow = (props: any) => {
  return (
    <Edit actions={false}>
      <SimpleForm>
        <TextInput source="filename" />
        <TextInput source="length" disabled />
        <ArrayField source="metadata.accessHistory" >
          <Datagrid bulkActionButtons={false} sx={{ width: 1, '& .RaDatagrid-headerCell': {
          backgroundColor: blue[200],
        },}}>
            <TextField source="Type" sortable={false} />
            <DateField source="Date" showTime locales="jp-JP" sortable={false} />
            <TextField source="Protocol" sortable={false} />
            <TextField source="Info" sortable={false} />
          </Datagrid>
        </ArrayField>
      </SimpleForm>
    </Edit>
  )
}
export default FileShow;