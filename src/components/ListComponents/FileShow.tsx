import {
  ArrayField,
  DateField,
  Datagrid,
  Edit,
  SimpleForm,
  TextField,
  TextInput,
} from 'react-admin';

const FileShow = (props: any) => {
  return (
    <Edit actions={false}>
      <SimpleForm>
        <TextInput source="filename" />
        <TextInput source="length" disabled />
        <ArrayField source="metadata.accessHistory" >
          <Datagrid bulkActionButtons={false} sx={{ width: 1 }}>
            <TextField source="Type" sortable={false} />
            <DateField source="Date" showTime locales="jp-JP" sortable={false} />
            <TextField source="Protocol" sortable={false} />
            <TextField source="fromName" sortable={false} />
            <TextField source="toName" sortable={false} />
          </Datagrid>
        </ArrayField>
      </SimpleForm>
    </Edit>
  )
}
export default FileShow;