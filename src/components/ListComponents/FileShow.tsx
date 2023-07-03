import {
    ArrayField,
    DateField,
    Datagrid,
    Show,
    SimpleShowLayout,
    TextField,
} from 'react-admin';

const FileShow = (props: any) => {
    return (
    <Show>
        <SimpleShowLayout>
            <TextField source="filename" label="FileName" />
            <ArrayField source="accessHistory">
                <Datagrid bulkActionButtons={false}>
                    <TextField source="Type" />
                    <DateField source="Date" showTime locales="jp-JP"/>
                    <TextField source="Protocol" />
                </Datagrid>
            </ArrayField>
        </SimpleShowLayout>
    </Show>
    )
}
export default FileShow;