import * as React from 'react';
import {
  Menu,
  useDataProvider,
  useNotify,
  Confirm,
} from 'react-admin';
import {
  List,
  MenuItem,
  Typography,
  Box,
  Collapse,
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
  const [works, setWorks] = React.useState([]);
  const [openState, dispatch] = React.useReducer(reducerFunc, initialState)
  const [activeItem, setActiveItem] = React.useState("")
  const [fire, setFire] = React.useState<boolean>(false);
  const dataProvider = useDataProvider()
  const [open, setOpen] = React.useState(false);
  const notify = useNotify()
  const handleClick = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);
  const handleConfirm = () => {
    setOpen(false);
  };
  const getListParams = {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: "", order: 'ASC' },
    filter: ""
  }
  React.useEffect(() => {
    dataProvider.getList("works", getListParams).then((result: any) => {
      setWorks(result.data)
    }).catch((response: any) => {
      notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.message } })
    })
  }, [])
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
              ml: 2
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
            <Menu.Item to={"/connections/" + menuItemData.name} primaryText="接続先選択" sx={{ borderRadius: 5, }} leftIcon={<CableIcon />} />
            <Menu.Item to={"/files/" + menuItemData.name} primaryText="作業ファイル" sx={{ borderRadius: 5, }} leftIcon={<InsertDriveFileIcon />} />
            <Menu.Item to={"/history/" + menuItemData.name} primaryText="接続履歴" sx={{ borderRadius: 5, }} leftIcon={<HistoryIcon />} />
          </Box>}
        />
      );
    });
  }, [fire, activeItem])
  return (
    <Menu>
      <Confirm
        isOpen={open}
        title={"move"}
        content="move workflow"
        onConfirm={handleConfirm}
        onClose={handleDialogClose}
      />
      <Menu.Item to="/" primaryText="ホームページ" leftIcon={<HomeIcon />} />
      <MenuItem onClick={() => setOpen(true)}>
        <OpenInNewIcon sx={{ color: "text.secondary" }} />
        <Typography sx={{ ml: 2, color: "text.secondary" }} >
          {"ワークフロー申請"}
        </Typography>
      </MenuItem>
      <Menu.Item to="/files/public" primaryText="public" leftIcon={<CloudUploadIcon />} />
      <Typography variant="body2" sx={{ ml: 1, mt: 1 }}>
        {"作業一覧"}
      </Typography>
      {MenuWorkItems(works)}
    </Menu>
  )
};