
import * as React from 'react';
import {
  InfiniteList,
  TextField,
  FunctionField,
  DateField,
  useTranslate,
} from 'react-admin';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Button,
} from '@mui/material';
import { ConnectButton } from '../buttons/ConnectButton'
import { SFTPConnectButton } from '../buttons/SFTPConnectButton'
import { AppContext, workerTheme } from '../../App'
import { ActiveConnectionPanel } from '../layouts/ActiveConnectionPanel'
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
  const { setTheme } = React.useContext(AppContext);
  const [activeFire, setActiveFire] = React.useState(false)
  const translate = useTranslate()
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
          localStorage.setItem('theme', 'worker')
        }}>
          {translate('guacamole.changeWorker')}
        </Button>
      </Box>

    </Box>
  );
  if (localStorage.getItem('theme') === "admin") return <AdminAccess />
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
      // actions={<ActiveConnectionPanel />}
      aside={<ConnectionFilterMenu workId={workId} />}
      resource={"connections/" + workId}
      exporter={false}
    >
      <CustomDatagrid bulkActionButtons={false} >
        <TextField label="guacamole.field.id" source="identifier" width="0%" />
        <TextField label="guacamole.field.connectName" source="name" width="50%" />
        <FunctionField label="guacamole.field.protocol" sortBy="protocol" render={(record: any) => {
          if (record.protocol === "ssh") return translate('guacamole.filter.protocol.ssh')
          else if (record.protocol === "rdp") return translate('guacamole.filter.protocol.rdp')
          else if (record.protocol === "telnet") return translate('guacamole.filter.protocol.telnet')
          else if (record.protocol === "vnc") return translate('guacamole.filter.protocol.vnc')
        }} />
        <TextField label="guacamole.field.parent" source="parentIdentifier" />
        <DateField label="guacamole.field.lastActive" source="lastActive" showTime />
        <Box width="0%" sx={{display:"inline-flex"}}>
          <ConnectButton
            type="c"
            workId={workId}
          />
          <SFTPConnectButton />
        </Box>

      </CustomDatagrid>
    </InfiniteList>
  </FireContext.Provider>
  );
};

export default ConnectionsList;