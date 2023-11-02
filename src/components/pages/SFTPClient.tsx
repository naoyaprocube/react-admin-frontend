
import * as React from 'react';
import {
  InfiniteList,
  FunctionField,
  DateField,
  TopToolbar,
  useTranslate,
  useDataProvider,
  useNotify,
} from 'react-admin';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { humanFileSize, resolvePath } from '../utils'
import { DirRoute } from '../layouts/DirRoute'
import { useParams } from "react-router-dom";
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import FolderIcon from '@mui/icons-material/Folder';
import { CustomDatagrid } from '../layouts/CustomDatagrid'
import { useNavigate } from "react-router-dom";

const SFTPClient = (props: any) => {
  const { workId, connectionId } = useParams()
  const [dirId, setDirId] = React.useState(null);
  const [cwd, setCwd] = React.useState(null);
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
          setDirId(json._id)
          setDir(json)
        }
      }).catch((response: any) => {
        notify('file.statusCodeError', { type: 'error', messageArgs: { code: 500, text: "There is no work directory" } })
      })
    }
    else dataProvider.getdir("files", { id: dirId }).then((result: any) => {
      const json = JSON.parse(result.body)
      setDir(json)
    }).catch((response: any) => {
      notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.message } })
    })
  }, [workId, dirId])
  React.useEffect(() => {
    if (!cwd) {
      dataProvider.gethome("sftp", {
        connectionId: connectionId,
        token: localStorage.getItem('token')
      }).then((result: any) => {
        if (result === null) {
          notify('file.statusCodeError', { type: 'error', messageArgs: { code: 500, text: result.message } })
        }
        else {
          setCwd(resolvePath(result.body))
        }
      }).catch((response: any) => {
        notify('file.statusCodeError', { type: 'error', messageArgs: { code: 500, text: "There is no work directory" } })
      })
    }
  }, [])
  const SFTPBulkActionButtons = (props: any) => (
    <React.Fragment>
    </React.Fragment>
  );
  const FilesListActions = (props: any) => {
    return (
      <TopToolbar sx={{ width: 1 }}>
        {Object.keys(dir).length !== 0 ? <DirRoute dir={dir} isMongo={true} /> : null}
      </TopToolbar>
    )
  }
  const SFTPActions = (props: any) => {
    const fullpath = cwd.split("/")
    fullpath.shift()
    const sftpDir = {
      dirname: fullpath[fullpath.length - 1],
      fullpath: cwd === "/" ? [] : fullpath
    }
    return (
      <TopToolbar sx={{ width: 1 }}>
        <DirRoute dir={sftpDir} isMongo={false} />

      </TopToolbar>
    )
  }
  return (<>
    <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 2 }}>
      <Link
        underline="hover"
        color="inherit"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        {translate('pages.workSelect')}
      </Link>
      <Link
        underline="hover"
        color="inherit"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/connections/' + workId)}
      >
        {translate('pages.connectionSelect')}
      </Link>
      <Typography color="text.primary">
        {translate('pages.fileManager')}
      </Typography>
    </Breadcrumbs>
    <Box sx={{ display: "inline-flex", width: 1 }}>
      {dirId ?
        <InfiniteList
          {...props}
          title={workId === "public" ? translate('pages.publicFileManager') : translate('pages.fileManager')}
          resource={"files"}
          queryOptions={{ meta: { includeDir: true, dirId: dirId } }}
          exporter={false}
          disableSyncWithLocation
          actions={<FilesListActions />}

          sx={{ width: "50%", p: 1 }}
        >
          <CustomDatagrid
            bulkActionButtons={<SFTPBulkActionButtons />}
            isRowSelectable={(record: any) => record.dirname ? false : true}
          >
            <FunctionField width="30%" source="filename" label="file.fields.name" render={(record: any) => {
              if (record.dirname) return (
                <Box sx={{ display: "inline-flex" }}>
                  <Link
                    underline="hover"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setDirId(record._id)}
                    sx={{ display: "inline-flex" }}
                  >
                    <FolderIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                      {record.dirname}
                    </Typography>
                  </Link>
                </Box>
              )
              else if (record.filename) return (
                <Box sx={{ display: "inline-flex" }}>
                  <InsertDriveFileOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">
                    {record.filename}
                  </Typography>
                </Box>
              )
            }} />
            <FunctionField width="20%" source="length" label="file.fields.length" sortBy="length" render={(record: any) => {
              if (record.dirname) return "-"
              else return humanFileSize(record.length, false)
            }
            } />
            <DateField width="20%" source="uploadDate" label="file.fields.uploadDate" showTime locales="jp-JP" />

          </CustomDatagrid>
        </InfiniteList>
        : null}
      {cwd ?
        <InfiniteList
          {...props}
          title={" "}
          resource={"sftp"}
          queryOptions={{
            meta: {
              path: cwd,
              connectionId: connectionId,
              token: localStorage.getItem('token')
            }
          }}
          exporter={false}
          disableSyncWithLocation
          actions={<SFTPActions />}
          sx={{ width: "50%", p: 1, }}
        >
          <CustomDatagrid
            bulkActionButtons={<SFTPBulkActionButtons />}
            isRowSelectable={(record: any) => record.longname[0] === "d" ? false : true}
          >
            <FunctionField width="30%" source="filename" label="file.fields.filename" render={(record: any) => {
              if (record.longname[0] === "d") return (
                <Box sx={{ display: "inline-flex" }}>
                  <Link
                    underline="hover"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setCwd(resolvePath(cwd + "/" + record.filename))}
                    sx={{ display: "inline-flex" }}
                  >
                    <FolderIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">
                      {record.filename}
                    </Typography>
                  </Link>
                </Box>
              )
              else return (
                <Box sx={{ display: "inline-flex" }}>
                  <InsertDriveFileOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">
                    {record.filename}
                  </Typography>
                </Box>
              )
            }} />
            <FunctionField width="20%" source="attrs.size" label="file.fields.length" sortBy="attrs.size" render={(record: any) => humanFileSize(record.attrs.size, false)} />
            <DateField width="20%" source="attrs.mmtime" label="file.fields.uploadDate" showTime locales="jp-JP" />

          </CustomDatagrid>
        </InfiniteList>
        : null}
    </Box>
  </>)
};

export default SFTPClient;