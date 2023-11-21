
import * as React from 'react';
import { useAccessToken } from '../../tokenProvider'
import {
  InfiniteList,
  Confirm,
  useRecordContext,
  useTranslate,
  useDataProvider,
} from 'react-admin';
import {
  Box,
  Card,
  Collapse,
  colors,
  Typography,
  Breadcrumbs,
  Button,
  IconButton,
} from '@mui/material';
import { CustomDatagrid } from '../layouts/CustomDatagrid'
import { WorkFilterMenu } from '../layouts/FilterMenu'
import AnnounceBoard from '../layouts/AnnounceBoard'
import { statusToColor } from "../utils"
import { useNavigate } from "react-router-dom";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CableIcon from '@mui/icons-material/Cable';
import HistoryIcon from '@mui/icons-material/History';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import ConnectedTvIcon from '@mui/icons-material/ConnectedTv';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Dashboard = (props: any) => {
  const dataProvider = useDataProvider()
  const translate = useTranslate()
  const navigate = useNavigate()
  const [accessToken] = useAccessToken()
  const [open, setOpen] = React.useState(false);
  const handleClick = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);
  const handleConfirm = () => {
    dataProvider.getenv("files", {}).then((res: any) => {
      setOpen(false);
      return res
    }).then(({ json }: any) => {
      window.open(json.idmUrl, "admingate_idmurl")
    })
  };
  const NameField = (props: any) => {
    const record = useRecordContext();
    const color = statusToColor(record)
    return (
      <Box sx={{ display: 'inline-flex', width: 1 }}>
        <Box>
          <Box sx={{
            display: 'inline-flex',
            border: 1,
            borderRadius: 2,
            p: 0.3,
            bgcolor: color
          }}>
            <Typography variant="body2" sx={{ color: colors.red }}>
              {record.idmIdentifier}
            </Typography>
          </Box>
          <Typography sx={{ ml: 2 }}>
            {record.name}
          </Typography>
        </Box>
      </Box>

    )
  }
  const ConnectionField = (props: any) => {
    const record = useRecordContext();
    const [open, setOpen] = React.useState(false);
    const parents: Array<any> = []
    record.connections.map((connection: any) => {
      if (parents.indexOf(connection.hostname) === -1) parents.push(connection.hostname)
    })
    return (
      <Card sx={{ width: 1 }}>
        <Box sx={{ width: 1, display: 'inline-flex', flexDirection: 'row', borderBottom: 0.6, p: 0.5 }}>
          <ConnectedTvIcon fontSize="small" sx={{ ml: -0.5 }} />
          <Typography variant="body1" component="pre" sx={{ ml: 1 }}>
            {translate('guacamole.deviceConnection')}
          </Typography>
        </Box>
        {parents.length > 0 ? (<>
          <Box sx={{ pl: 1, pr: 1, display: 'flex', flexWrap: 'wrap', borderBottom: 0.2 }}>
            <Typography variant="body2">
              {parents[0]}
            </Typography>
          </Box>
          <Collapse in={open} collapsedSize={0} >
            {parents.map((parent: any, index: number) => {
              return (index === 0 ? null :
                <Box sx={{ pl: 1, pr: 1, display: 'flex', flexWrap: 'wrap', borderBottom: 0.2 }}>
                  <Typography variant="body2">
                    {parent}
                  </Typography>
                </Box>)
            })}
          </Collapse>
        </>)
          : <Typography variant="body2" style={{ color: "#757575" }} align="center">
            {translate('guacamole.none')}
          </Typography>
        }
        <Box sx={{ display: 'flex', width: 1, justifyContent: 'center' }}>
          {parents.length <= 1 ? null :
            <IconButton onClick={() => setOpen(open => !open)}>
              {!open ? <MoreVertIcon fontSize="small" />
                : <ExpandLessIcon fontSize="small" />
              }
            </IconButton>
          }
        </Box>
      </Card>
    );
  };

  const DurationField = (props: any) => {
    const record = useRecordContext();
    const [open, setOpen] = React.useState(false);
    return (
      <Card sx={{ width: 1 }}>
        <Box sx={{ width: 1, display: 'inline-flex', flexDirection: 'row', borderBottom: 0.6, p: 0.5 }}>
          <TimelapseIcon fontSize="small" sx={{ ml: -0.5 }} />
          <Typography variant="body1" component="pre" sx={{ ml: 1 }}>
            {translate('guacamole.period')}
          </Typography>
        </Box>
        {record.periods.length > 0 ? (<>
          <Box sx={{ pl: 1, pr: 1, display: 'flex', flexWrap: 'wrap', borderBottom: 0.2 }}>
            <Typography variant="body2" component="pre">
              {record.periods[0].validFrom} ~ {record.periods[0].validUntil}
            </Typography>
            <Typography variant="body2" component="pre" sx={{ ml: 1 }}>
              {record.periods[0].startTime} - {record.periods[0].endTime}
            </Typography>
          </Box>
          <Collapse in={open} collapsedSize={0} >
            {record.periods.map((period: any, index: number) => {
              return (index === 0 ? null :
                <Box sx={{ pl: 1, pr: 1, display: 'flex', flexWrap: 'wrap', borderBottom: 0.2 }}>
                  <Typography variant="body2" component="pre">
                    {period.validFrom} ~ {period.validUntil}
                  </Typography>
                  <Typography variant="body2" component="pre" sx={{ ml: 1 }}>
                    {period.startTime} - {period.endTime}
                  </Typography>
                </Box>)
            })}
          </Collapse>
        </>) : <Typography variant="body2" style={{ color: "#757575" }} align="center">
          {translate('guacamole.none')}
        </Typography>
        }
        <Box sx={{ display: 'flex', width: 1, justifyContent: 'center' }}>
          {record.periods.length <= 1 ? null :
            <IconButton onClick={() => setOpen(open => !open)}>
              {!open ? <MoreVertIcon fontSize="small" />
                : <ExpandLessIcon fontSize="small" />
              }
            </IconButton>
          }
        </Box>
      </Card>
    );
  };

  const WorkLinkButtons = (props: any) => {
    const record = useRecordContext();
    return (
      <Box className="links" sx={{ display: "flex", flexDirection: 'column', justifyContent: "space-around", align: "right" }}>
        {localStorage.getItem('theme') === "worker" ?
          <Button variant="contained" disabled={!record.isNow} startIcon={<CableIcon />} onClick={() => navigate('/connections/' + record.id)} sx={{ ml: 1, width: 250, height: 30 }}>
            <Typography variant="body2">
              {translate('guacamole.workStart')}
            </Typography>
          </Button> : null
        }
        <Button variant="contained" startIcon={<HistoryIcon />} onClick={() => navigate('/history/' + record.id)} sx={{ mt: 0.5, ml: 1, width: 250, height: 30 }}>
          <Typography variant="body2">
            {translate('pages.connectionHistory')}
          </Typography>
        </Button>
        <Button variant="contained" startIcon={<InsertDriveFileIcon />} onClick={() => navigate('/files/' + record.id)} sx={{ mt: 0.5, ml: 1, width: 250, height: 30 }}>
          <Typography variant="body2">
            {translate('pages.fileManager')}
          </Typography>
        </Button>
      </Box>
    );
  }
  return (<Box>
    <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 2 }}>
      <Typography color="text.primary">
        {translate('pages.workSelect')}
      </Typography>
    </Breadcrumbs>
    <Confirm
      isOpen={open}
      title={translate('guacamole.moveWorkflowTitle')}
      content={translate('guacamole.moveWorkflowContent')}
      onConfirm={handleConfirm}
      onClose={handleDialogClose}
    />
    <Box sx={{ display: "flex", flexDirection: 'row' }}>
      <Box sx={{ display: "flex", flexDirection: 'column', mt: 2 }}>
        <Button variant="contained" startIcon={<OpenInNewIcon />} onClick={handleClick} sx={{ ml: 1, width: 250, height: 30, borderRadius: 5 }}>
          <Typography variant="body2" color="primary.contrastText">
            {translate('pages.workflow')}
          </Typography>
        </Button>
        <Button variant="contained" startIcon={<CloudUploadIcon />} onClick={() => navigate('/files/public')} sx={{ mt: 2, ml: 1, width: 250, height: 30, borderRadius: 5 }}>
          <Typography variant="body2" color="primary.contrastText">
            {translate('pages.publicFileManager')}
          </Typography>
        </Button>
        {localStorage.getItem('theme') === "admin" ?
          <Button variant="contained" startIcon={<HistoryIcon />} onClick={() => navigate('/history/all')} sx={{ mt: 2, ml: 1, width: 250, height: 30, borderRadius: 5 }}>
            <Typography variant="body2" color="primary.contrastText">
              {translate('pages.allConnectionHistory')}
            </Typography>
          </Button> : null
        }
      </Box>
      <Box sx={{ display: "flex", flexDirection: 'column', ml: 2, width: 1 }}>
        <Typography variant="h6" sx={{ ml: 2 }} color="text.primary">
          {translate('guacamole.announcement')}
        </Typography>
        <AnnounceBoard token={accessToken} />
      </Box>
    </Box>
    <Box sx={{ borderBottom: 1, width: 280, ml: 2 }}>
      <Typography variant="h5" component="pre" sx={{ ml: 2, }} color="text.primary">
        {translate('guacamole.works')}
      </Typography>
    </Box>
    <InfiniteList {...props}
      title={translate('pages.homepage')}
      aside={<WorkFilterMenu />}
      resource={"works"}
      queryOptions={{ meta: { token: accessToken, theme: localStorage.getItem('theme') } }}
      exporter={false}
      filterDefaultValues={{ theme: localStorage.getItem('theme') }}
      sx={{
        '& .MuiToolbar-root': { display: "none" },
      }}
    >
      <CustomDatagrid
        bulkActionButtons={false}
        sx={{
          '& .links': { justifyContent: 'flex-end' },
          '& .RaDatagrid-headerRow': { display: 'none' }
        }}
      >
        <NameField />
        <ConnectionField className="ConnectionField" />
        <DurationField className="DurationField" />
        <WorkLinkButtons width="0%" />
      </CustomDatagrid>
    </InfiniteList>

  </Box >
  );
};

export default Dashboard;