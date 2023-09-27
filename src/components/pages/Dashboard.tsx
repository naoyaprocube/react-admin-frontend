
import * as React from 'react';
import {
  InfiniteList,
  Datagrid,
  TextField,
  Confirm,
  useRecordContext,
  useTranslate,
  useDataProvider,
  useNotify,
} from 'react-admin';
import {
  Box,
  Card,
  colors,
  Typography,
  Breadcrumbs,
  Button,
} from '@mui/material';
import { CustomDatagrid } from '../layouts/CustomDatagrid'
import { WorkFilterMenu } from '../layouts/FilterMenu'
import AnnounceBoard from '../layouts/AnnounceBoard'
import { useNavigate } from "react-router-dom";
import { stringToColor } from "../utils"
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CableIcon from '@mui/icons-material/Cable';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import TimelapseIcon from '@mui/icons-material/Timelapse';

const Dashboard = (props: any) => {
  const dataProvider = useDataProvider()
  const translate = useTranslate()
  const notify = useNotify()
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false);
  const handleClick = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);
  const handleConfirm = () => {
    setOpen(false);
  };

  const WorkPanel = () => {
    const record = useRecordContext();
    return (
      <Box sx={{ ml: 3 }}>
        <Box sx={{ width: 1, display: 'inline-flex', flexDirection: 'row', borderBottom: 0.6 }}>
          <TimelapseIcon fontSize="small" />
          <Typography variant="body2" sx={{ ml: 1, mt: 0.3 }}>
            {translate('guacamole.period')}
          </Typography>
        </Box>
        {record.periods.map((period: any) => <Box sx={{ ml: 2, display: 'flex', flexWrap: 'wrap', borderBottom: 0.2 }}>
          <Typography variant="body2" component="pre">
            {period.validFrom} ~ {period.validUntil}
          </Typography>
          <Typography variant="body2" component="pre" sx={{ ml: 1 }}>
            {period.startTime} - {period.endTime}
          </Typography>
        </Box>)}
      </Box>
    );
  };
  const NameField = (props: any) => {
    const record = useRecordContext();
    const color = stringToColor(record.idmIdentifier)
    return (
      <Box sx={{ display: 'inline-flex' }}>
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
  const WorkLinkButtons = (props: any) => {
    const record = useRecordContext();
    return (
      <Box className="links" sx={{ display: "flex", flexDirection: 'column', justifyContent: "space-around", align: "right" }}>
        <Button variant="contained" startIcon={<CableIcon />} onClick={() => navigate('/connections/' + record.id)} sx={{ ml: 1, width: 250, height: 30 }}>
          <Typography variant="body2" color="primary.contrastText">
            {translate('guacamole.workStart')}
          </Typography>
        </Button>
        <Button variant="contained" startIcon={<InsertDriveFileIcon />} onClick={() => navigate('/files/' + record.id)} sx={{ mt: 0.5, ml: 1, width: 250, height: 30 }}>
          <Typography variant="body2" color="primary.contrastText">
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
    <Box sx={{ display: "flex", flexDirection: 'row', mb: 2 }}>
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
      </Box>
      <Box sx={{ display: "flex", flexDirection: 'column', ml: 2, mt: 1, width: 1 }}>
        <Typography variant="h6" sx={{ ml: 2 }} color="text.primary">
          {translate('guacamole.announcement')}
        </Typography>
        <AnnounceBoard />
      </Box>
    </Box>
    <Box sx={{ borderBottom: 1, width: 200, ml: 2 }}>
      <Typography variant="h5" sx={{ ml: 2, }} color="text.primary">
        {translate('guacamole.works')}
      </Typography>
    </Box>
    <InfiniteList {...props}
      title={translate('pages.homepage')}
      aside={<WorkFilterMenu />}
      resource={"works"}
      exporter={false}
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
        <NameField width="40%" />
        <WorkPanel />
        <WorkLinkButtons width="0%"/>
      </CustomDatagrid>
    </InfiniteList>

  </Box >
  );
};

export default Dashboard;