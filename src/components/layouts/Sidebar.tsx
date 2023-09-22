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
  Typography,
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
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import HomeIcon from '@mui/icons-material/Home';
import CableIcon from '@mui/icons-material/Cable';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import HistoryIcon from '@mui/icons-material/History';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
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
    { name: "WorkC" },
  ]
  const [openState, dispatch] = React.useReducer(reducerFunc, initialState)
  const [activeItem, setActiveItem] = React.useState("")
  const [fire, setFire] = React.useState<boolean>(false);
  interface Props {
    dense: boolean;
    handleToggle: () => void;
    isOpen: boolean;
    isParent: boolean;
    name: string;
    id: string;
    children: React.ReactNode;
  }
  const MenuWorkItem = React.useCallback((props: Props) => {
    const { handleToggle, isOpen, name, id, isParent, children, dense } = props;
    const isActive = (activeItem === id)
    const ItemIcon = () => (<>
      {isParent ?
        isOpen ? <><KeyboardArrowDownIcon sx={{ color: "text.secondary" }} fontSize="small" /><WorkspacesIcon sx={{ color: "text.secondary" }} /></>
          : <><KeyboardArrowRightIcon sx={{ color: "text.secondary" }} fontSize="small" /><WorkspacesIcon sx={{ color: "text.secondary" }} /></>
        : <><KeyboardArrowDownIcon sx={{ color: "text.secondary" }} fontSize="small" /><WorkspacesIcon sx={{ color: "text.secondary" }} /></>
      }
    </>
    )
    const header = (
      <MenuItem
        dense={dense}
        sx={{
          ml: -1,
          width: 1,
          overflow: 'auto',
        }}
        onClick={handleToggle}
        disableRipple
      >
        <ItemIcon />
        <Typography sx={{ ml: 1, color: "text.secondary" }} >
          {name}
        </Typography>

      </MenuItem>
    )
    return (
      <div>
        {
          header
        }
        <Collapse in={isOpen} >
          <List
            dense={dense}
            component="div"
            disablePadding
            sx={{
              ml: 1.5
            }}
            children={children}
          />
        </Collapse>
      </div>
    );
  }, []);
  const MenuWorkItems = React.useCallback((menuItems: Array<Object>) => {
    return menuItems.map((menuItemData: any) => {
      const index = openState.map((v: any) => v.id).indexOf(menuItemData.name)
      const isOpen = (index !== -1 && openState[index]) ? openState[index].isOpen : false
      return (
        <MenuWorkItem
          handleToggle={() => {
            dispatch({ id: menuItemData.name, isOpen: !isOpen, index: index })
            setFire(fire => !fire)
          }}
          isOpen={isOpen}
          isParent={true}
          name={menuItemData.name}
          id={menuItemData.name}
          dense={false}
          children={<Box>
            <Menu.Item to={"/connections/" + menuItemData.name} primaryText="接続先選択" sx={{borderRadius: 5,}} leftIcon={<CableIcon />} />
            <Menu.Item to={"/files/" + menuItemData.name} primaryText="作業ファイル" sx={{borderRadius: 5,}} leftIcon={<InsertDriveFileIcon />} />
            <Menu.Item to={"/history/" + menuItemData.name} primaryText="接続履歴" sx={{borderRadius: 5,}} leftIcon={<HistoryIcon />} />
          </Box>}
        />
      );
    });
  }, [fire, activeItem])
  return (
    <Menu>
      <Menu.Item to="/files/" primaryText="ホームページ" leftIcon={<HomeIcon />} />
      <Menu.Item to="/files/" primaryText="ワークフロー申請" leftIcon={<OpenInNewIcon />} />
      <Menu.Item to="/files/public" primaryText="public" leftIcon={<CloudUploadIcon />} />
      <Typography variant="body2" sx={{ ml: 1, mt: 1 }}>
        {"作業一覧"}
      </Typography>
      {MenuWorkItems(works)}
    </Menu>
  )
};