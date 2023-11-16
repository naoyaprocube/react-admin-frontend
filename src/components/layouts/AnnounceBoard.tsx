
import * as React from 'react';
import {
  InfiniteList,
  TextField,
  DateField,
  useTranslate,
  useListContext,
} from 'react-admin';
import {
  Box,
  Typography,
} from '@mui/material';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { CustomDatagrid } from '../layouts/CustomDatagrid'

const AnnounceBoard = (props: any) => {
  const translate = useTranslate()
  const Empty = () => (
    <Box sx={{ mt: 1, width: 1 }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: 4,
        width: 1
      }}>
        <TipsAndUpdatesIcon sx={{
          width: '3em',
          height: '3em',
          color: 'text.secondary',
        }} />
      </Box>
      <Typography variant="h4" align="center" sx={{ color: 'text.secondary' }}>
        {translate("guacamole.noAnnouncement")}
      </Typography>
    </Box>
  )
  const Datagrid = () => {
    const { total } = useListContext();
    if (!total) return (<Empty />)
    return (<CustomDatagrid
      bulkActionButtons={false}
      sx={{
        boxShadow: 0,
        '& .RaDatagrid-headerRow': { display: 'none' },
      }}
    >
      <DateField source="startDate" width="0%" />
      <Box sx={{ width: 1 }}>
        <TextField source="message" width="100%" style={{ whiteSpace: 'pre-wrap' }} />
      </Box>
    </CustomDatagrid>)
  }
  return (<Box sx={{
    height: 180,
    width: 1,
    overflow: 'auto',
    border: 1,
    borderRadius: 2,
  }}>
    <InfiniteList
      resource={"announce"}
      title={" "}
      empty={<Empty />}
      disableSyncWithLocation
      sx={{
        '& .MuiToolbar-root': { display: "none" },
        '& .MuiTableCell-root': {
          verticalAlign: 'top',
          borderBottom: 'none',
        },
        '& .MuiCard-root': { boxShadow: 0 },
      }}
    >
      <Datagrid />
    </InfiniteList>

  </Box >
  );
};

export default AnnounceBoard;