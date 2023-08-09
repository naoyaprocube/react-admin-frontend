
import {
  List,
  Datagrid,
  TextField,
  DeleteWithConfirmButton,
  ShowButton,
  FunctionField,
  DateField,
  useRecordContext,
  useTranslate,
  CreateButton,
} from 'react-admin';
import Box from '@mui/material/Box';
import { blue } from '@mui/material/colors';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { DownloadButton, humanFileSize } from './utils'
import FilesListActions from './FilesListActions'
import { useParams } from "react-router-dom";
import NoteAddIcon from '@mui/icons-material/NoteAdd';

const DeleteButton = () => {
  const record = useRecordContext()
  const { id } = useParams()
  return (<DeleteWithConfirmButton label="" redirect={"/dirs/" + id} translateOptions={{ id: record.filename }} />)
}

const FilesList = (props: any) => {
  const { id } = useParams()
  return (
    <List {...props} hasCreate resource={id} exporter={false} actions={<FilesListActions />}>
      <Datagrid sx={{
        '& .RaDatagrid-headerCell': {
          backgroundColor: blue[200],
        },
      }}>
        <TextField source="filename" label="file.fields.filename" sortable={false} sx={{ flexGrow: 1 }} />
        <FunctionField source="length" label="file.fields.length" sortable={true} sortBy="length" render={(record: any) => humanFileSize(record.length, false)} />
        <DateField source="uploadDate" label="file.fields.uploadDate" showTime locales="jp-JP" />
        <TextField source="metadata.status" label="file.fields.metadata.status" sortable={false} />
        <Box className="ActionButtons" sx={{ display: 'flex', alignSelf: 'flex-end' }}>
          <DownloadButton />
          <ShowButton label="" icon={<InfoOutlinedIcon />} />
          <DeleteButton />
        </Box>
      </Datagrid>
    </List>
  );
};

export default FilesList;