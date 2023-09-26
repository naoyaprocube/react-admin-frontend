
import * as React from 'react';
import {
  InfiniteList,
  TextField,
  DateField,
  CreateButton,
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
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useParams } from "react-router-dom";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { CustomDatagrid } from '../layouts/CustomDatagrid'
import { ConnectionFilterMenu } from '../layouts/FilterMenu'

const ConnectionsList = (props: any) => {
  const { work } = useParams()
  const dataProvider = useDataProvider()
  const translate = useTranslate()
  const notify = useNotify()
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
  );
  return (<Box>
    <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 2 }}>
      <Link
        underline="hover"
        color="inherit"
        href="/"
      >
        従事作業選択
      </Link>
      <Typography color="text.primary">接続先選択</Typography>
    </Breadcrumbs>
    <InfiniteList {...props} aside={<ConnectionFilterMenu />} title={"connect"} empty={<Empty />} resource={"connections/" + work} exporter={false}>
      <CustomDatagrid bulkActionButtons={false} >
        <TextField source="name" width="50%" className="connectionName"/>
        <TextField source="protocol" />
        <DateField source="lastActive" />
        <Button variant="contained">
          接続
        </Button>
      </CustomDatagrid>
    </InfiniteList>
  </Box >
  );
};

export default ConnectionsList;