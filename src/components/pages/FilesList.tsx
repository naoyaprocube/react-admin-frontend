
import * as React from 'react';
import {
  List,
  Datagrid,
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
  ButtonGroup
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { humanFileSize } from '../utils'
import { DirRoute } from '../layouts/DirRoute'
import DownloadButton from '../buttons/DownloadButton'
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useParams } from "react-router-dom";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import DirMenu from '../layouts/Dirmenu';
import { CustomDatagrid } from '../layouts/CustomDatagrid'

const FilesList = (props: any) => {
  const { workId, dirId } = useParams()
  const [id, setId] = React.useState(dirId ? dirId : null);
  const dataProvider = useDataProvider()
  const translate = useTranslate()
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
        notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.message } })
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
        <DeleteWithConfirmButton label="" redirect={"/files/" + id} translateOptions={{ id: record.filename }} />
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
        {Object.keys(dir).length !== 0 ? <DirRoute dir={dir} /> : null}
        <CreateButton
          resource={"files/" + workId + "/" + id}
          icon={<NoteAddIcon />}
          label={translate('file.upload')}
        />
      </TopToolbar>
    )
  }
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
          color: 'primary.main',
        }} />
      </Box>
      <Box width={1} sx={{
        display: 'flex',
        justifyContent: 'space-evenly',
        mt: 1
      }}>
        <CreateButton
          resource={"files/" + workId + "/" + id}
          icon={<NoteAddIcon />}
          label={translate('file.upload')}
          size="large"
        />
      </Box>
      <Typography variant="h4" align="center" sx={{ color: 'text.secondary' }}>
        {translate('ra.page.empty')}
      </Typography>


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
      <Typography color="text.primary">ファイル一覧</Typography>
    </Breadcrumbs>
    {id ?
      <List {...props} aside={<DirMenu workId={workId} />} title={"Files"} empty={<Empty />} resource={"files/" + id} exporter={false} actions={<FilesListActions />}>
        <CustomDatagrid>
          <TextField width="50%" source="filename" label="file.fields.filename" sortable={false} className={"filename"} sx={{ width: 1, }} />
          <FunctionField width="10%" source="length" label="file.fields.length" sortable={true} sortBy="length" render={(record: any) => humanFileSize(record.length, false)} />
          <DateField width="10%" source="uploadDate" label="file.fields.uploadDate" showTime locales="jp-JP" />
          <TextField width="10%" source="metadata.status" label="file.fields.metadata.status" className="status" sortable={false} />
          <ButtonGroup variant="text" className="ActionButtons" sx={{ display: 'inline-flex' }}>
            <DownloadButton />
            <FileShowButton />
            <DeleteButton />
          </ButtonGroup>
        </CustomDatagrid>
      </List>
      : null}
  </Box>)
};

export default FilesList;