
import * as React from 'react';
import {
  List,
  TextField,
  DeleteWithConfirmButton,
  ShowButton,
  FunctionField,
  DateField,
  useRecordContext,
  TopToolbar,
  CreateButton,
  useTranslate,
  useDataProvider,
  useNotify,
} from 'react-admin';
import {
  Box,
  Tooltip,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  ButtonGroup
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { humanFileSize } from '../utils'
import { DirRoute } from '../layouts/DirRoute'
import DownloadButton from '../buttons/DownloadButton'
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useParams } from "react-router-dom";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirMenu from '../layouts/Dirmenu';
import { CustomDatagrid } from '../layouts/CustomDatagrid'
import { useNavigate } from "react-router-dom";

const FilesList = (props: any) => {
  const { workId, dirId } = useParams()
  const [id, setId] = React.useState(dirId ? dirId : null);
  const dataProvider = useDataProvider()
  const translate = useTranslate()
  const navigate = useNavigate()
  const notify = useNotify()
  const [dir, setDir] = React.useState({});
  React.useEffect(() => {
    if (!dirId) {
      dataProvider.getdir("files", { id: "workDir-" + workId }).then((result: any) => {
        if (result === null) {
          notify('file.statusCodeError', { type: 'error', messageArgs: { code: 500, text: result.message } })
        }
        else {
          const json = JSON.parse(result.body)
          setId(json._id)
          setDir(json)
        }
      }).catch((response: any) => {
        notify('file.statusCodeError', { type: 'error', messageArgs: { code: 500, text: "There is no work directory" } })
      })
    }
    else dataProvider.getdir("files", { id: dirId }).then((result: any) => {
      const json = JSON.parse(result.body)
      setDir(json)
      setId(json._id)
    }).catch((response: any) => {
      notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.message } })
    })
  }, [workId, dirId])

  const DeleteButton = () => {
    const record = useRecordContext()
    return <Tooltip title={translate('ra.action.delete')} placement="top-start">
      <Box>
        <DeleteWithConfirmButton label="" redirect={"/files/" + workId + "/" + id} translateOptions={{ id: record.filename }} />
      </Box>
    </Tooltip>
  }
  const FileShowButton = () => (
    <Tooltip title={translate('file.infoIcon')} placement="top-start">
      <Box>
        <ShowButton
          resource={"files/" + workId + "/" + id}
          label=""
          icon={<InfoOutlinedIcon />} />
      </Box>
    </Tooltip>
  )
  const FilesListActions = (props: any) => {
    return (
      <TopToolbar sx={{ width: 1 }}>
        {Object.keys(dir).length !== 0 ? <DirRoute dir={dir} isMongo={true} /> : null}
        <CreateButton
          resource={"files/" + workId + "/" + id}
          icon={<NoteAddIcon />}
          label={translate('file.upload')}
        />
      </TopToolbar>
    )
  }
  const Empty = () => (
    <Box sx={{ width: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: 1,
      }}>
        <FolderOpenIcon sx={{
          width: '6em',
          height: '6em',
          color: 'primary.main',
        }} />
      </Box>
      <Box width={1} sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: -2
      }}>
        <CreateButton
          resource={"files/" + workId + "/" + id}
          icon={<NoteAddIcon />}
          label={translate('file.upload')}
          size="large"
        />
      </Box>
      <Typography variant="h4" align="center" sx={{ color: 'text.secondary' }}>
        {translate('file.empty')}
      </Typography>
    </Box>
  );
  const FileActionButtons = (props: any) => (
    <ButtonGroup variant="text" className="ActionButtons" sx={{ display: 'inline-flex' }}>
      <DownloadButton />
      <FileShowButton />
      <DeleteButton />
    </ButtonGroup>
  )
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
      {workId === "public" ?
        <Typography color="text.primary">
          {translate('pages.publicFileManager')}
        </Typography>
        : <Typography color="text.primary">
          {translate('pages.fileManager')}
        </Typography>
      }
    </Breadcrumbs>
    {id ?
      <List
        {...props}
        title={workId === "public" ? translate('pages.publicFileManager') : translate('pages.fileManager')}
        aside={<DirMenu workId={workId} />}
        empty={<Empty />}
        resource={"files"}
        queryOptions={{ meta: { includeDir: false, dirId: id } }}
        exporter={false}
        actions={<FilesListActions />}
      >
        <CustomDatagrid>
          <FunctionField width="30%" source="filename" label="file.fields.filename" render={(record: any) => (
            <Box sx={{ display: "inline-flex" }}>
              <InsertDriveFileOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">
                {record.filename}
              </Typography>
            </Box>
          )} />
          <FunctionField width="20%" source="length" label="file.fields.length" sortBy="length" render={(record: any) => humanFileSize(record.length, false)} />
          <DateField width="20%" source="uploadDate" label="file.fields.uploadDate" showTime locales="jp-JP" />
          <FunctionField width="20%" source="metadata.status" label="file.fields.metadata.status" render={(record: any) => (
            <Box sx={{ display: "inline-flex" }}>
              {record.metadata.status === "COMPLETE" ? <CheckCircleIcon fontSize="small" color="success" sx={{ mr: 0.5 }} /> : null}
              <Typography variant="body2">
                {record.metadata.status}
              </Typography>
            </Box>
          )} />
          <FileActionButtons width="0%" />
        </CustomDatagrid>
      </List>
      : null}
  </Box>)
};

export default FilesList;