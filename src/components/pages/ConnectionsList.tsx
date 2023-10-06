
import * as React from 'react';
import {
  InfiniteList,
  useInfinitePaginationContext,
  TextField,
  DateField,
  CreateButton,
  useRecordContext,
  useTranslate,
  useDataProvider,
  useNotify,
} from 'react-admin';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Button,
} from '@mui/material';
import { ConnectButton } from '../buttons/ConnectButton'
import { ThemeContext, workerTheme, adminTheme } from '../../App'
import { ActiveConnectionPanel } from '../layouts/ActiveConnectionPanel'
import { useCookies } from 'react-cookie';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useParams } from "react-router-dom";
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { CustomDatagrid } from '../layouts/CustomDatagrid'
import { ConnectionFilterMenu } from '../layouts/FilterMenu'
import { useNavigate } from "react-router-dom";
type FFireContext = {
  fire: boolean,
  setFire: React.Dispatch<React.SetStateAction<boolean>>
}
export const FireContext = React.createContext({} as FFireContext);
const ConnectionsList = (props: any) => {
  const { workId } = useParams()
  const dataProvider = useDataProvider()
  const { theme, setTheme } = React.useContext(ThemeContext);
  const [cookies, setCookie, removeCookie] = useCookies(["theme"]);
  const [activeFire, setActiveFire] = React.useState(false)
  const translate = useTranslate()
  const notify = useNotify()
  const navigate = useNavigate()
  const AdminAccess = () => (
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
        {translate('guacamole.notWorkerInfo')}
      </Typography>
      <Box width={1} sx={{
        display: 'flex',
        justifyContent: 'center',
      }}>
        <Button onClick={() => {
          setTheme(workerTheme)
          setCookie("theme", "worker")
        }}>
          {translate('guacamole.changeWorker')}
        </Button>
      </Box>

    </Box>
  );
  if (cookies.theme === "admin") return <AdminAccess />
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
      <Typography color="text.primary">
        {translate('pages.connectionSelect')}
      </Typography>
    </Breadcrumbs>
    <InfiniteList {...props}
      title={translate('pages.connectionSelect')}
      actions={<ActiveConnectionPanel />}
      aside={<ConnectionFilterMenu workId={workId} />}
      resource={"connections/" + workId}
      exporter={false}
    >
      <CustomDatagrid bulkActionButtons={false} >
        <TextField label="guacamole.field.id" source="identifier" width="0%" />
        <TextField label="guacamole.field.connectName" source="name" width="50%" />
        <TextField label="guacamole.field.protocol" source="protocol" className="protocol" />
        <TextField label="guacamole.field.parent" source="parentIdentifier" />
        <DateField label="guacamole.field.lastActive" source="lastActive" showTime />
        <Box width="0%">
          <ConnectButton type="c" />
        </Box>

      </CustomDatagrid>
    </InfiniteList>
  </FireContext.Provider>
  );
};

export default ConnectionsList;