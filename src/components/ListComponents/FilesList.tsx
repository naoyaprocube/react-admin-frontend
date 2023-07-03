
import {
  List,
  Datagrid,
  TextField,
  DeleteButton,
  useNotify,
  useRecordContext,
  useDataProvider,
  ShowButton,
  FunctionField,
  DateField
} from 'react-admin';
import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Box from '@mui/material/Box';

const DownloadButton = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  if (!record) return null;
  return <Button color="primary" startIcon={< FileDownloadIcon />} onClick={() => {
    notify(`Downloading file`, { type: 'info' })
    dataProvider.download('files',{ "id": record.id })
  }}></Button>;
};
function humanFileSize(bytes:any, si=false, dp=1) {
  const thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }
  const units = si 
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10**dp;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  return bytes.toFixed(dp) + ' ' + units[u];
}


// const FilePanel = () => {
//   const record = useRecordContext();
//   return (
//       <div dangerouslySetInnerHTML={{ __html: record.uploadDate }} />
//   );
// };
const FilesList = (props:any) => {
  return (
    <List {...props} >
      <Datagrid bulkActionButtons={false}>
        <TextField source="filename" label="File" />
        <FunctionField label="size" render={(record:any) => humanFileSize(record.length,true)} />
        <DateField source="uploadDate" showTime locales="jp-JP"/>
        <Box sx={{flexGrow: 1}}>
          <ShowButton label="History" />
          <DownloadButton />
          <DeleteButton label="" mutationMode="pessimistic" />
        </Box>

        {/* <Button color="primary" onClick={GetFile}>Custom Action</Button> */}
        {/* <EditButton label="" icon=< FileDownloadIcon /> /> */}

      </Datagrid>
    </List>
  );
};

export default FilesList;