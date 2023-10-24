
import * as React from 'react';
import {
  List,
  TextField,
  FunctionField,
  DateField,
  useTranslate,
  useDataProvider,
  useNotify,
} from 'react-admin';
import {
  Box,
  Button,
  Typography,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { AppContext, adminTheme } from '../../App'
import { useParams } from "react-router-dom";
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { HistoryFilterMenu } from '../layouts/FilterMenu'
import { RecordPlayButton } from '../buttons/RecordPlayButton'
import { RecordTextDownloadButton } from '../buttons/RecordTextDownloadButton'
import dayjs, { extend } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CustomDatagrid } from '../layouts/CustomDatagrid'
import { useNavigate } from "react-router-dom";

extend(duration);
extend(relativeTime);

const HistoryList = (props: any) => {
  const { workId } = useParams()
  const translate = useTranslate()
  const navigate = useNavigate()
  const { theme, setTheme } = React.useContext(AppContext);
  const WorkerAccess = () => (
    <Box sx={{ width: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: 1,
      }}>
        <PersonOffIcon sx={{
          width: '6em',
          height: '6em',
          color: 'primary.main',
        }} />
      </Box>
      <Typography variant="h4" align="center" sx={{ color: 'text.secondary' }}>
        {translate('guacamole.notAdminInfo')}
      </Typography>
      <Box width={1} sx={{
        display: 'flex',
        justifyContent: 'center',
      }}>
        <Button onClick={() => {
          setTheme(adminTheme)
          localStorage.setItem('theme', 'admin')
        }}>
          {translate('guacamole.changeAdmin')}
        </Button>
      </Box>

    </Box>
  );
  if (workId === "all" && localStorage.getItem('theme') === "worker") return <WorkerAccess />
  return (<Box>
    <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 2 }}>
      <Link
        underline="hover"
        color="inherit"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        {translate('pages.workSelect')}
      </Link>
      {workId === "all" ?
        <Typography color="text.primary">
          {translate('pages.allConnectionHistory')}
        </Typography>
        :
        <Typography color="text.primary">
          {translate('pages.connectionHistory')}
        </Typography>
      }
    </Breadcrumbs>
    <List {...props} title={translate('pages.connectionHistory')} aside={<HistoryFilterMenu />} resource={"history/" + workId} exporter={false}>
      <CustomDatagrid bulkActionButtons={false}>
        <DateField label="guacamole.field.startDate" source="startDate" showTime locales="jp-JP" />
        <TextField label="guacamole.field.usename" source="username" />
        <TextField label="guacamole.field.connectionIdentifier" source="connectionIdentifier" />
        <TextField label="guacamole.field.connectName" source="connectionName" />
        <FunctionField label="guacamole.field.duration" sortBy="duration" render={(record: any) => {
          if (record.endDate === null) return "-"
          const duration = dayjs.duration(record.endDate - record.startDate)
          return duration.humanize();
        }} />
        <Box sx={{display: 'inline-flex'}}>
          <RecordPlayButton />
          <RecordTextDownloadButton />
        </Box>

      </CustomDatagrid>

    </List>
  </Box >
  );
};

export default HistoryList;