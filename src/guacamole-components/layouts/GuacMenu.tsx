import * as React from 'react';
import {
  Menu,
  useDataProvider,
  useTranslate,
  useNotify,
} from 'react-admin';
import {
  List,
  MenuItem,
  colors,
  Box,
  Collapse,
  Tooltip,
  IconButton,
  ButtonGroup,
  Card,
  CardContent,
} from '@mui/material';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import WorkspacesTwoToneIcon from '@mui/icons-material/WorkspacesTwoTone';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import HomeIcon from '@mui/icons-material/Home';
import CableIcon from '@mui/icons-material/Cable';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
const initialState = [{}]
const reducerFunc = (openState: Array<any>, obj: any) => {
  const state = openState
  if (obj.id && !state.map((v: any) => v.id).includes(obj.id)) {
    state.push(obj)
    return state
  }
  else if (obj.index) {
    const index = obj.index
    delete obj.index
    state.splice(index, 1, obj)
    return state
  }
  return state
}
export const GuacMenu = () => {
  const works = [
    { name: "WorkA" },
    { name: "WorkB" },
    { name: "WorkC" }
  ]

  const [openState, dispatch] = React.useReducer(reducerFunc, initialState)

  return (
    <Menu>
      <Menu.Item to="/files/root" primaryText="ホームページ" leftIcon={<HomeIcon />} />
      <Menu.Item to="/files/root" primaryText="ワークフロー申請" leftIcon={<OpenInNewIcon />} />
      <Menu.Item to="/files/root" primaryText="public ディレクトリ" leftIcon={<CloudUploadIcon />} />
      <Menu.Item to="/files/root" primaryText="作業一覧" leftIcon={<WorkspacesIcon />} />
      <Menu.Item to="/files/root" primaryText="作業A" sx={{ ml: 2 }} leftIcon={<WorkspacesTwoToneIcon />} />
      <Menu.Item to="/files/root" primaryText="作業B" sx={{ ml: 2 }} leftIcon={<WorkspacesTwoToneIcon />} />
      <Menu.Item to="/connections/test" primaryText="接続先選択" sx={{ ml: 4 }} leftIcon={<CableIcon />} />
      <Menu.Item to="/files/test/root" primaryText="作業ディレクトリ" sx={{ ml: 4, bgcolor: "primary.light", borderRadius: 5 }} leftIcon={<InsertDriveFileIcon />} />
      <Menu.Item to="/files/root" primaryText="接続履歴" sx={{ ml: 4 }} leftIcon={<HistoryIcon />} />
      <Menu.Item to="/files/root" primaryText="作業C" sx={{ ml: 2 }} leftIcon={<WorkspacesTwoToneIcon />} />
      <Menu.Item to="/files/root" primaryText="作業D" sx={{ ml: 2 }} leftIcon={<WorkspacesTwoToneIcon />} />
    </Menu>
  )
};