
import * as React from 'react';
import {
  InfiniteList,
  TextField,
  DateField,
  useTranslate,
  useDataProvider,
  useListContext,
  useNotify,
} from 'react-admin';
import {
  Box,
  Typography,
} from '@mui/material';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { CustomDatagrid } from '../layouts/CustomDatagrid'

const AnnounceBoard = (props: any) => {
  const translate = useTranslate()
  const notify = useNotify()
  const Empty = () => (
    <Box sx={{ mt: 1 }}>
      <Box width={1} sx={{
        display: 'flex',
        justifyContent: 'space-evenly',
        mt: 1
      }}>
        <TipsAndUpdatesIcon sx={{
          width: '3em',
          height: '3em',
          color: 'text.secondary',
        }} />
      </Box>
      <Typography variant="h4" align="center" sx={{ color: 'text.secondary' }}>
        {translate("お知らせはありません")}
      </Typography>
    </Box>
  )
  const Datagrid = () => {
    const { data, isLoading } = useListContext();
    if (data.length === 0) return (<Empty />)
    return (<CustomDatagrid
      bulkActionButtons={false}
      sx={{
        boxShadow: 0,
        '& .RaDatagrid-headerRow': { display: 'none' },
      }}
    >
      <DateField source="startDate" width="5%" />
      <Box sx={{ maxWitdh: 1 }}>
        <TextField source="message" style={{ whiteSpace: 'pre-wrap' }} />
      </Box>
    </CustomDatagrid>)
  }
  return (<Box sx={{
    height: 200,
    width: 1,
    overflow: 'auto',
    border:1,
    borderRadius: 2,
  }}>
    <InfiniteList
      title={"connect"}
      resource={"announce"}
      empty={<Empty />}
      sx={{
        '& .MuiToolbar-root': { display: "none" },
        '& .MuiTableCell-root': {
          verticalAlign: 'top',
          borderBottom: `1px solid #ffffff`,
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