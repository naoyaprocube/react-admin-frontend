
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
} from 'react-admin';
import { Box, Tooltip, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { humanFileSize } from '../utils'
import { DirRoute } from '../layouts/DirRoute'
import DownloadButton from '../buttons/DownloadButton'
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useParams } from "react-router-dom";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

const FilesList = (props: any) => {
  const { id } = useParams()
  const dataProvider = useDataProvider()
  const translate = useTranslate()
  const [dir, setDir] = React.useState({ dirname: "root", _id: "root", fullpath: [] });
  React.useEffect(() => {
    dataProvider.getdir({ id: id }).then((result: any) => {
      const json = JSON.parse(result.body)
      setDir(json)
    })
  }, [id])
  const DeleteButton = () => {
    const record = useRecordContext()
    const { id } = useParams()
    return <Tooltip title={translate('ra.action.delete')} placement="top-start">
      <Box>
        <DeleteWithConfirmButton label="" redirect={"/dirs/" + id} translateOptions={{ id: record.filename }} />
      </Box>
    </Tooltip>
  }
  const FileShowButton = () => (
    <Tooltip title={translate('file.infoIcon')} placement="top-start">
      <Box>
        <ShowButton label="" icon={<InfoOutlinedIcon />} />
      </Box>
    </Tooltip>
  )
  const FilesListActions = (props: any) => {
    return (
      <TopToolbar sx={{width: 1}}>
        <DirRoute dir={dir}/>
        <CreateButton
          icon={<NoteAddIcon />}
          label={translate('file.upload')}
        />
      </TopToolbar>
    )
  }
  const Empty = () => (
    <Box sx={{ mt: 5 }} width={1}>
      <Box width={1} sx={{
        display: 'flex',
        justifyContent: 'space-evenly',
        mt: 1
      }}>
        <FolderOpenIcon sx={{
          width: '9em',
          height: '9em',
          color: 'text.secondary',
        }} />
      </Box>

      <Typography variant="h4" align="center" sx={{ color: 'text.secondary' }}>
        {translate('ra.page.empty')}
      </Typography>
      <Typography variant="body1" align="center" sx={{ mt: 3, color: 'text.secondary' }}>
        {translate('ra.page.invite')}
      </Typography>
      <Box width={1} sx={{
        display: 'flex',
        justifyContent: 'space-evenly',
        mt: 1
      }}>
        <CreateButton
          icon={<NoteAddIcon />}
          label={translate('file.upload')}
          size="large"
        />
      </Box>

    </Box>
  );
  return (
    <List {...props} title={dir.dirname} empty={<Empty />} resource={id} exporter={false} actions={<FilesListActions />}>
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
          <FileShowButton />
          <DeleteButton />
        </Box>
      </Datagrid>
    </List>
  );
};

export default FilesList;