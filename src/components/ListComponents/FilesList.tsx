
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
import { blue } from '@mui/material/colors';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const DownloadButton = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  if (!record) return null;
  return <Button color="primary" sx={{ display: 'inline-flex' }} startIcon={< FileDownloadIcon />} onClick={() => {
    notify(`Downloading file`, { type: 'info' })
    dataProvider.download('files', { "id": record.id })
  }}></Button>;
};
function humanFileSize(bytes: any, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }
  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;
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
const FilesList = (props: any) => {
  return (
    <List {...props} exporter={false}>
      <Datagrid sx={{
                '& .RaDatagrid-headerCell': {
                    backgroundColor: blue[200],
                },
            }}>
        <TextField source="filename" label="File" sortable={false} sx={{ flexGrow: 1 }}/>
        <FunctionField label="Size" sortable={true} sortBy="length" render={(record: any) => humanFileSize(record.length, false)} />
        <DateField source="uploadDate" label="UploadDate" showTime locales="jp-JP" />
        <Box className="ActionButtons" sx={{ display: 'flex',alignSelf: 'flex-end'  }}>
          <DownloadButton />
          <ShowButton label="" icon={<InfoOutlinedIcon />} />
          <DeleteButton label="" mutationMode="pessimistic" />
        </Box>
      </Datagrid>
    </List>
  );
};

export default FilesList;