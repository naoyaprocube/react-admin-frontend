
import * as React from 'react';
import { useAccessToken } from '../../tokenProvider'
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
  Tooltip,
  Breadcrumbs,
  Link,

} from '@mui/material';
import { AppContext, adminTheme } from '../../App'
import { ReactTerm } from '../layouts/ReactTerm'
import { useParams } from "react-router-dom";
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { HistoryFilterMenu } from '../layouts/FilterMenu'
import { RecordPlayButton } from '../buttons/RecordPlayButton'
import { RecordTextDownloadButton } from '../buttons/RecordTextDownloadButton'
import { RMConnectionButton } from '../buttons/RMConnectionButton'
import dayjs, { extend } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CustomDatagrid } from '../layouts/CustomDatagrid'
import { useNavigate } from "react-router-dom";

extend(duration);
extend(relativeTime);
type FFireContext = {
  fire: boolean,
  setFire: React.Dispatch<React.SetStateAction<boolean>>
}
export const FireContext = React.createContext({} as FFireContext);
const HistoryList = (props: any) => {
  const { workId } = useParams()
  const translate = useTranslate()
  const navigate = useNavigate()
  const dataProvider = useDataProvider()
  const [accessToken] = useAccessToken()
  const [actives, setActives]: any = React.useState([])
  const [activeFire, setActiveFire] = React.useState(false)


  const { theme, setTheme } = React.useContext(AppContext);
  React.useEffect(() => {
    dataProvider.getActives("connections", { token: accessToken, workId: workId }).then((result: any) => {
      const ids = result.map((v: any) => {
        return v.identifier
      })
      setActives(ids)
    })
  }, [activeFire])
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
  return (<FireContext.Provider value={{ fire: activeFire, setFire: setActiveFire }}>
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
    <List
      {...props}
      title={translate('pages.connectionHistory')}
      aside={<HistoryFilterMenu />}
      resource={"history"}
      queryOptions={{ meta: { token: accessToken, workId: workId } }}
    >
      <CustomDatagrid bulkActionButtons={false}>
        <DateField label="guacamole.field.startDate" source="startDate" showTime locales="jp-JP" />
        <TextField label="guacamole.field.username" source="username" />
        <TextField label="guacamole.field.hostname" source="hostname" />
        <FunctionField label="guacamole.field.protocol" sortBy="protocol" render={(record: any) => {
          if (record.protocol === "ssh") return translate('guacamole.filter.protocol.ssh')
          else if (record.protocol === "rdp") return translate('guacamole.filter.protocol.rdp')
          else if (record.protocol === "telnet") return translate('guacamole.filter.protocol.telnet')
          else if (record.protocol === "vnc") return translate('guacamole.filter.protocol.vnc')
        }} />
        <FunctionField label="guacamole.field.duration" sortBy="duration" render={(record: any) => {
          if (record.endDate === null) return "-"
          const duration = dayjs.duration(record.endDate - record.startDate)
          return (<Typography variant="body2">
            {duration.format('HH:mm:ss')}
          </Typography>)
        }} />
        <Box sx={{ display: 'inline-flex' }}>
          <RecordPlayButton />
          <RecordTextDownloadButton token={accessToken} />
          <RMConnectionButton actives={actives} />
          <ReactTerm />
        </Box>
      </CustomDatagrid>
    </List>
  </FireContext.Provider>

  );
};

export default HistoryList;