
import * as React from 'react';
import {
  List,
  TextField,
  DeleteWithConfirmButton,
  FunctionField,
  DateField,
  useRecordContext,
  CreateButton,
  useTranslate,
  useDataProvider,
  useNotify,
} from 'react-admin';
import {
  Box,
  Tooltip,
  Typography,
  Breadcrumbs,
  Link,
} from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useParams } from "react-router-dom";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { HistoryFilterMenu } from '../layouts/FilterMenu'
import dayjs, { extend } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CustomDatagrid } from '../layouts/CustomDatagrid'

extend(duration);
extend(relativeTime);

const HistoryList = (props: any) => {
  const { work } = useParams()
  const dataProvider = useDataProvider()
  const translate = useTranslate()
  const notify = useNotify()
  const Empty = () => (
    <Box sx={{ mt: 5, ml: 15 }}>
      <Box width={1} sx={{
        display: 'flex',
        justifyContent: 'space-evenly',
        mt: 1
      }}>
        <FolderOpenIcon sx={{
          width: '6em',
          height: '6em',
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
          resource="files"
          icon={<NoteAddIcon />}
          label={translate('file.upload')}
          size="large"
        />
      </Box>

    </Box>
  );
  const DeleteButton = () => {
    const record = useRecordContext()
    return <Tooltip title={translate('ra.action.delete')} placement="top-start">
      <Box>
        <DeleteWithConfirmButton label="" />
      </Box>
    </Tooltip>
  }
  return (<Box>
    <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 2 }}>
      <Link
        underline="hover"
        color="inherit"
        href="/"
      >
        従事作業選択
      </Link>
      <Typography color="text.primary">接続履歴</Typography>
    </Breadcrumbs>
    <List {...props} aside={<HistoryFilterMenu />} title={"connect"} empty={<Empty />} resource={"history/" + work} exporter={false}>
      <CustomDatagrid bulkActionButtons={false}>
        <TextField source="username" />
        <TextField source="remoteHost" />
        <DateField source="startDate" showTime locales="jp-JP" />
        <FunctionField label="Duration" render={(record:any) => {
          const duration = dayjs.duration(record.endDate - record.startDate)
          return duration.humanize();
        }} />
      </CustomDatagrid>
    </List>
  </Box >
  );
};

export default HistoryList;