import {
  ArrayField,
  DateField,
  Datagrid,
  Show,
  Edit,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
} from 'react-admin';

const FileShow = (props: any) => {
  return (
    <Edit>
        <SimpleForm>
            <TextInput source="filename" label="FileName" />
            <ArrayField source="metadata.accessHistory" label="AccessHistory" >
                <Datagrid bulkActionButtons={false} sx={{ width: 1 }}>
                    <TextField source="Type" sortable={false}/>
                    <DateField source="Date" showTime locales="jp-JP" sortable={false}/>
                    <TextField source="Protocol" sortable={false}/>
                    <TextField source="fromName" sortable={false}/>
                    <TextField source="toName" sortable={false}/>
                </Datagrid>
            </ArrayField>
        </SimpleForm>
    </Edit>
  )
}
export default FileShow;