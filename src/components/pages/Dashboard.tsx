
import * as React from 'react';
import {
  InfiniteList,
  Datagrid,
  TextField,
  useRecordContext,
  CreateButton,
  useTranslate,
  useDataProvider,
  useNotify,
} from 'react-admin';
import {
  Box,
  Typography,
  Breadcrumbs,
  Button,
} from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { WorkFilterMenu } from '../layouts/FilterMenu'
import AnnounceBoard from '../layouts/AnnounceBoard'
import { useNavigate } from "react-router-dom";

const Dashboard = (props: any) => {
  const dataProvider = useDataProvider()
  const translate = useTranslate()
  const notify = useNotify()
  const navigate = useNavigate()

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
  )
  const WorkPanel = () => {
    const record = useRecordContext();
    return (
      <>
        {record.name}
      </>
    );
  };
  return (<Box>
    <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 2 }}>
      <Typography color="text.primary">従事作業選択</Typography>
    </Breadcrumbs>
    <Box sx={{ display: "flex", flexDirection: 'row', justifyContent: "space-around" }}>
      <Box sx={{ display: "flex", flexDirection: 'column', mt: 2 }}>
        <Button variant="contained" sx={{ ml: 1, width: 250, height: 30, borderRadius: 5 }}>
          <Typography variant="body2" color="primary.contrastText">ワークフロー申請</Typography>
        </Button>
        <Button variant="contained" sx={{ mt: 2, ml: 1, width: 250, height: 30, borderRadius: 5 }}>
          <Typography variant="body2" color="primary.contrastText">公開領域ファイルマネージャ</Typography>
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: 'column', ml: 2, mt: 1 }}>
        <Typography variant="h6" sx={{ ml: 2 }} color="primary.contrastText">お知らせ</Typography>
        <AnnounceBoard />
      </Box>
    </Box>
    <Box sx={{ borderBottom: 1, width: 200}}>
      <Typography variant="h5" sx={{ ml: 2 }} color="primary.contrastText">担当作業一覧</Typography>
    </Box>
    <InfiniteList {...props}
      aside={<WorkFilterMenu />}
      title={"connect"}
      resource={"works"}
      empty={<Empty />}
      exporter={false}
      sx={{
        '& .MuiToolbar-root': { display: "none" },
      }}
    >
      <Datagrid
        bulkActionButtons={false}
        expand={<WorkPanel />}
        sx={{
          '& .links': { justifyContent: 'flex-end' },
          '& .RaDatagrid-headerRow': { display: 'none' }
        }}>
        <Box sx={{ minWidth: 300 }}>
          <TextField source="name" />
        </Box>
        <Box className="links" sx={{ width: 200, display: "flex", flexDirection: 'column', justifyContent: "space-around", align: "right" }}>
          <Button variant="contained" sx={{ ml: 1, width: 200, height: 30 }}>
            <Typography variant="body2" color="primary.contrastText">作業開始</Typography>
          </Button>
          <Button variant="contained" sx={{ mt: 0.5, ml: 1, width: 200, height: 30 }}>
            <Typography variant="body2" color="primary.contrastText">作業領域マネージャ</Typography>
          </Button>
        </Box>

      </Datagrid>
    </InfiniteList>

  </Box >
  );
};

export default Dashboard;