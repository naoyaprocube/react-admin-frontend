
import * as React from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket'
import {
  InfiniteList,
  FunctionField,
  DateField,
  TopToolbar,
  useTranslate,
  useDataProvider,
  useUnselectAll,
  useRecordContext,
  useNotify,
} from 'react-admin';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  IconButton,
  ButtonGroup,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
} from '@mui/material';

import { humanFileSize, resolvePath } from '../utils'
import { DirRoute } from '../layouts/DirRoute'
import { useParams } from "react-router-dom";
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';
import FolderIcon from '@mui/icons-material/Folder';
import { CustomDatagrid } from '../layouts/CustomDatagrid'
import { SFTPMKDirButton } from '../buttons/SFTPMKDirButton'
import { SFTPOpenStatsButton } from '../buttons/SFTPOpenStatsButton'
import { SFTPDeleteButton } from '../buttons/SFTPDeleteButton'
import { useNavigate } from "react-router-dom";
import LinearProgress from '@mui/material/LinearProgress';
import { useRefresh } from 'react-admin';
import { v4 } from 'uuid'
import { EventEmitter } from 'events'

const SFTPClient = (props: any) => {
  const { workId, connectionId } = useParams()
  const [workIdState, setWorkIdState] = React.useState<string>(workId);
  const [dirId, setDirId] = React.useState<string>(null);
  const [cwd, setCwd] = React.useState<string>(null);
  const [json, setJson] = React.useState<string>()
  const [count, setCount] = React.useState<number>(-1)
  const [length, setLength] = React.useState<number>(0)
  const [checkDir, setCheckDir] = React.useState<string>(null)
  const [dir, setDir] = React.useState<any>({});
  const [work, setWork]: any = React.useState({})
  const [wsUrl, setWsUrl] = React.useState(null);
  const socketRef = React.useRef<ReconnectingWebSocket>()
  const dataProvider = useDataProvider()
  const SFTPEmitter = new EventEmitter()
  const translate = useTranslate()
  const navigate = useNavigate()
  const notify = useNotify()
  const refresh = useRefresh();
  const sftpUnselectAll = useUnselectAll('sftp');
  const increment = () => {
    setCount((prevCount) => {
      return prevCount + 1
    })
  }


  SFTPEmitter.on("reset", () => {
    setCount(-2)
    setTimeout(() => setCount(-1), 2000)
  })

  React.useEffect(() => {
    if (wsUrl) {
      const websocket = new ReconnectingWebSocket(`${wsUrl}/api/sftp/websocket?id=${connectionId}&token=${localStorage.getItem('token')}`)
      socketRef.current = websocket

      const onMessage = (event: MessageEvent<string>) => {
        const res = JSON.parse(event.data)
        switch (res.type) {
          case "serverReady":
            websocket.send(JSON.stringify({ type: "gethome" }))
            break
          case "readdirRes":
            setJson(event.data)
            break
          case "gethomeRes":
            setCwd(resolvePath(res.text))
            break
          case "unlinkRes":
            setCheckDir(String(res.path))
            break
          case "mkdirRes":
            setCheckDir(String(res.path))
            break
          case "rmdirRes":
            setCheckDir(String(res.path))
            break
          case "transferRes":
            increment()
            if (res.id[0] !== "/") {
              setCheckDir(String(res.cwd))
            }
            else refresh()
            break
          case "deleteRes":
            increment()
            if (res.id[0] === "/") {
              setCheckDir(String(res.cwd))
            }
            else refresh()
            break
          case "error":
            notify(res.info, { type: "error" })
            if (res.inc) increment()
            break
        }
      }
      websocket.addEventListener('message', onMessage)
      return () => {
        websocket.close()
        websocket.removeEventListener('message', onMessage)
      }
    }
  }, [wsUrl])
  React.useEffect(() => {
    if (count >= length) {
      SFTPEmitter.emit("reset")
    }
  }, [count, length])
  React.useEffect(() => {
    if (workIdState === "public") setWork({
      identifier: "public",
      idmIdentifier: "public"
    })
    else if (workIdState) dataProvider.getWork("works", { id: workIdState }).then((result: any) => {
      setWork(result)
    })
    else setWork({})
  }, [workIdState])
  React.useEffect(() => {
    if (work.idmIdentifier) {
      dataProvider.getdir("files", { id: "workDir-" + work.idmIdentifier }).then((result: any) => {
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
  }, [work])
  React.useEffect(() => {
    if (dirId) dataProvider.getdir("files", { id: dirId }).then((result: any) => {
      const json = JSON.parse(result.body)
      setDir(json)
    }).catch((response: any) => {
      notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.message } })
    })
  }, [dirId])
  React.useEffect(() => {
    if (cwd && !checkDir || (cwd && checkDir && cwd === checkDir)) {
      const json = {
        type: "readdir",
        path: cwd,
      }
      socketRef.current.send(JSON.stringify(json))
    }
    setCheckDir(null)
  }, [cwd, checkDir])
  React.useEffect(() => {
    dataProvider.getenv("files").then((result: any) => {
      setWsUrl(result.json.wsUrl)
    })
  }, [])

  const SFTPBulkActionButtons = (props: any) => {
    const { selectedIds, resource } = props

    if (count >= 0) return (
      <Box sx={{ display: 'inline-flex' }}>
        <CircularProgress size={20} />
        <Typography sx={{ pl: 1 }}>
          {count + "/" + length}
        </Typography>
      </Box>
    )
    else if (count === -2) return (
      <Box sx={{ display: 'inline-flex' }}>
        <CheckIcon fontSize="small" />
      </Box>
    )
    else return (
      <React.Fragment>
        <Button
          children={translate('sftp.transfer', { resource: resource })}
          sx={{ height: 20, ml: 0.5, textTransform: 'none' }}
          variant="text"
          onClick={() => {
            setLength(selectedIds.length)
            setCount(0)
            const uuid = v4()
            selectedIds.map((id: string) => {
              socketRef.current.send(JSON.stringify({
                type: "transfer",
                uuid: uuid,
                id: id,
                cwd: cwd,
                dirId: dirId,
              }))
            })
          }}
        />
        {resource === "sftp" ? <Button
          children={translate('sftp.delete', { resource: resource })}
          sx={{ height: 20, ml: 0.5, textTransform: 'none' }}
          variant="text"
          color="error"
          onClick={() => {
            setLength(selectedIds.length)
            setCount(0)
            selectedIds.map((id: string) => {
              socketRef.current.send(JSON.stringify({
                type: "delete",
                path: id,
                cwd: cwd,
              }))
            })
            sftpUnselectAll();
          }}
        /> : null}

      </React.Fragment>
    )
  }
  const DirSelect = () => {
    const handleChange = (event: SelectChangeEvent) => {
      setWorkIdState(event.target.value as string);
    };
    return (
      <Box sx={{ minWidth: 250, mb: -1 }}>
        <FormControl variant="standard" fullWidth size="small">
          <InputLabel id="select-label" size="small" >{translate('dir.selectManager')}</InputLabel>
          <Select
            labelId="select-label"
            id="select"
            value={workIdState}
            label="Dir"
            onChange={handleChange}
          >
            <MenuItem value={workId}>{translate('pages.fileManager')}</MenuItem>
            <MenuItem value={"public"}>{translate('pages.publicFileManager')}</MenuItem>
          </Select>
        </FormControl>
      </Box>
    );
  }
  const FilesListActions = (props: any) => {
    const fullpath = dir.fullpath
    const unique = "/" + fullpath.slice(1).join("/")
    return (
      <TopToolbar sx={{ width: 1 }}>
        {Object.keys(dir).length !== 0 ? <DirRoute dir={dir} isMongo={true} /> : null}
        <SFTPMKDirButton socket={socketRef.current} dirId={dirId} parent_path={unique} resource="mongo" />
        <DirSelect />
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
        <SFTPMKDirButton socket={socketRef.current} parent_path={cwd} resource="sftp" />
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
        {translate('pages.SFTPClient')}
      </Typography>
    </Breadcrumbs>
    <Box sx={{ display: "inline-flex", width: 1 }}>
      {!!dirId ?
        <InfiniteList
          {...props}
          title={translate('pages.SFTPClient')}
          resource={"files"}
          queryOptions={{ meta: { includeDir: true, dirId: dirId } }}
          exporter={false}
          disableSyncWithLocation
          actions={<FilesListActions />}
          sx={{ width: "50%", p: 1 }}
        >
          <CustomDatagrid
            bulkActionButtons={<SFTPBulkActionButtons resource={"files"} />}
            isRowSelectable={(record: any) => record.dirname !== ".."}
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
        : <Box sx={{ width: '50%', p: 1 }}>
          <LinearProgress />
        </Box>}
      {!!cwd ?
        <InfiniteList
          {...props}
          title={" "}
          resource={"sftp"}
          queryOptions={{
            meta: {
              json: json,
              path: cwd,
              connectionId: connectionId,
              token: localStorage.getItem('token')
            }
          }}
          exporter={false}
          disableSyncWithLocation
          actions={<SFTPActions />}
          sx={{ width: "50%", p: 1 }}
        >
          <CustomDatagrid
            bulkActionButtons={<SFTPBulkActionButtons resource={"sftp"} />}
            isRowSelectable={(record: any) => record.filename !== ".."}
          >
            <FunctionField width="30%" source="filename" label="file.fields.name" render={(record: any) => {
              if (record.longname[0] === "d") return (
                <Box sx={{ display: "inline-flex" }}>
                  <Link
                    underline="hover"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setCwd(resolvePath(cwd + "/" + record.filename))
                    }}
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
            <FunctionField width="20%" source="attrs.size" label="file.fields.length" sortBy="sortSize" render={(record: any) => humanFileSize(record.attrs.size, false)} />
            <DateField width="20%" sortBy="sortMtime" source="attrs.mmtime" label="file.fields.uploadDate" showTime locales="jp-JP" />
            <FunctionField width="0%" render={(record: any) => {
              return (<ButtonGroup>
                <SFTPOpenStatsButton />
                <SFTPDeleteButton socket={socketRef.current} />
              </ButtonGroup>)
            }} />
          </CustomDatagrid>
        </InfiniteList>
        : <Box sx={{ width: '50%', p: 1 }}>
          <LinearProgress />
        </Box>}
    </Box>
  </>)
};

export default SFTPClient;