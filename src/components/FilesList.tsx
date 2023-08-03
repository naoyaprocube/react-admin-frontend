
import {
  List,
  Datagrid,
  TextField,
  DeleteWithConfirmButton,
  ShowButton,
  FunctionField,
  DateField,
  useRecordContext
} from 'react-admin';
import Box from '@mui/material/Box';
import { blue } from '@mui/material/colors';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { DownloadButton, humanFileSize } from './utils'

const DeleteButton = () => {
  const record = useRecordContext()
  return (<DeleteWithConfirmButton label="" translateOptions={{id: record.filename}}/>)
}
const FilesList = (props: any) => {
  return (
    <List {...props} exporter={false}>
      <Datagrid sx={{
        '& .RaDatagrid-headerCell': {
          backgroundColor: blue[200],
        },
      }}>
        <TextField source="filename" sortable={false} sx={{ flexGrow: 1 }} />
        <FunctionField source="length" sortable={true} sortBy="length" render={(record: any) => humanFileSize(record.length, false)} />
        <DateField source="uploadDate" showTime locales="jp-JP" />
        <TextField source="metadata.status" sortable={false} />
        <Box className="ActionButtons" sx={{ display: 'flex', alignSelf: 'flex-end' }}>
          <DownloadButton />
          <ShowButton label="" icon={<InfoOutlinedIcon />} />
          <DeleteButton/>
        </Box>
      </Datagrid>
    </List>
  );
};

export default FilesList;