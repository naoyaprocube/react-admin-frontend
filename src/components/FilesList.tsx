
import * as React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DeleteWithConfirmButton,
  ShowButton,
  FunctionField,
  DateField,
  useRecordContext,
  TopToolbar,
  CreateButton,
  useTranslate,
  useDataProvider,
  Title,
} from 'react-admin';
import {Box, Button} from '@mui/material';
import { blue } from '@mui/material/colors';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { DownloadButton, humanFileSize } from './utils'
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useParams } from "react-router-dom";

const FilesList = (props: any) => {
  const { id } = useParams()
  const dataProvider = useDataProvider()
  const [dir, setDir] = React.useState({dirname:"root",_id:"root",fullpath:[]});
  React.useEffect(() => {
    dataProvider.getdir({id:id}).then((result: any) => {
      const json = JSON.parse(result.body)
      setDir(json)
    })
  }, [id])
  const DeleteButton = () => {
    const record = useRecordContext()
    const { id } = useParams()
    return (<DeleteWithConfirmButton label="" redirect={"/dirs/" + id} translateOptions={{ id: record.filename }} />)
  }
  const FilesListActions = (props: any) => {
    const translate = useTranslate()
    return (
      <TopToolbar>
        <CreateButton 
        icon={<NoteAddIcon/>}
        label={translate('file.upload')}
        />
      </TopToolbar>
    )
  }
  return (
    <List {...props} title={dir.dirname} hasCreate resource={id} exporter={false} actions={<FilesListActions />}>
      <Datagrid sx={{
        '& .RaDatagrid-headerCell': {
          backgroundColor: blue[100],
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