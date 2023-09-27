
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
import { useNavigate } from "react-router-dom";

extend(duration);
extend(relativeTime);

const HistoryList = (props: any) => {
  const { work } = useParams()
  const dataProvider = useDataProvider()
  const translate = useTranslate()
  const notify = useNotify()
  const navigate = useNavigate()
  return (<Box>
    <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 2 }}>
      <Link
        underline="hover"
        color="inherit"
        onClick={() => navigate('/')}
      >
        {translate('pages.workSelect')}
      </Link>
      <Typography color="text.primary">
        {translate('pages.connectionHistory')}
      </Typography>
    </Breadcrumbs>
    <List {...props} title={translate('pages.connectionHistory')} aside={<HistoryFilterMenu />} resource={"history/" + work} exporter={false}>
      <CustomDatagrid bulkActionButtons={false}>
        <TextField source="username" />
        <TextField source="remoteHost" />
        <DateField source="startDate" showTime locales="jp-JP" />
        <FunctionField label="Duration" render={(record: any) => {
          const duration = dayjs.duration(record.endDate - record.startDate)
          return duration.humanize();
        }} />
      </CustomDatagrid>
    </List>
  </Box >
  );
};

export default HistoryList;