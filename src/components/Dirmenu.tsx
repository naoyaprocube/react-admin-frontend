import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import {
  List,
  MenuItem,
  ListItemIcon,
  Collapse,
  Tooltip,
  IconButton,
  Button,
  ButtonGroup
} from '@mui/material';
import {
  Menu,
  useDataProvider,
} from 'react-admin';
import { useNavigate, useLocation } from "react-router-dom";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { useTranslate, useSidebarState } from 'react-admin';
import { MKDirButton, RemoveDirButton } from './utils'

interface Props {
  dense: boolean;
  handleToggle: () => void;
  isOpen: boolean;
  isParent: boolean;
  name: string;
  id: string;
  children: ReactNode;
}

const DirMenuItem = (props: Props) => {
  const { handleToggle, isOpen, name, id, isParent, children, dense } = props;
  const navigate = useNavigate()
  const location = useLocation();
  const split = location.pathname.split("/")
  let urlId = ""
  if (split[1] === "dirs") {
    urlId = split.pop()
  }
  else if (split[split.length - 1] === "create") {
    urlId = split[1]
  }
  else if (split[split.length - 1] === "show") {
    urlId = split[1]
  }
  const isActive = (urlId === id)
  const [sidebarIsOpen] = useSidebarState();
  const ItemIcon = () => {
    const buttonIcon = <>
      {isOpen ? <><KeyboardArrowDownIcon /><FolderOpenIcon /></> : <><KeyboardArrowRightIcon /><FolderIcon /></>}
    </>
    return <IconButton
      children={buttonIcon}
      onClick={handleToggle}
      disabled={!isParent}
    />
  }

  const header = (
    <ButtonGroup fullWidth variant={isActive ? "contained" : "text"} >
      <ItemIcon />
      <MenuItem
        dense={dense}
        divider={!isOpen}
        sx={{ ml: -1.2, width:1}}
        onClick={() => {
          navigate("/dirs/" + id)
        }}
      >
        {
          sidebarIsOpen ? <>
            {name}
          </> : <ArrowForwardIosIcon color="primary"/>
        }
      </MenuItem>
      {isActive ? <>
        <MKDirButton dirId={id} sidebarIsOpen={false} dirName={name}/>
        <RemoveDirButton mongoid={id} isRoot={id !== "root"} />
      </> : null}
    </ButtonGroup>
  )
  return (
    <div>
      {sidebarIsOpen ? (
        header
      ) : (
        <Tooltip title={name} placement="right">
          {header}
        </Tooltip>
      )}
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List
          dense={dense}
          component="div"
          disablePadding
          sx={{
            ml: sidebarIsOpen ? 1.5 : 0.2
          }}
        >
          {children}
        </List>
      </Collapse>
    </div>
  );
};

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
type FFireContext = {
  fire: boolean,
  setFire: React.Dispatch<React.SetStateAction<boolean>>
}
export const FireContext = React.createContext({} as FFireContext);

const DirMenu = () => {
  const [state, setState] = React.useState([{ _id: "root", dirname: "root", children: [] }]);
  const [openState, dispatch] = React.useReducer(reducerFunc, initialState)
  const [sidebarIsOpen] = useSidebarState();
  const dataProvider = useDataProvider()
  const [fire, setFire] = React.useState<boolean>(false);
  const [getdirFire, setGetdirFire] = React.useState<boolean>(false);

  React.useEffect(() => {
    dataProvider.getdirs().then((result: any) => {
      console.log("getdirs")
      const list = String(result.body)
        .split('"_id":\"')
        .map((str: String) => {
          const mongoid = str.split('\"')[0]
          return {
            id: mongoid,
            isOpen: false
          }
        })
      list.splice(0, 1)
      list.map((obj: Object) => {
        dispatch(obj)
      })
      const menu = JSON.parse(result.body)
      setState(menu)
    })
  }, [getdirFire])
  const fullpath: Array<String> = []
  const dirMenuItems = React.useCallback((menuItems: Array<Object>) => {
    return menuItems.map((menuItemData: any) => {
      const index = openState.map((v: any) => v.id).indexOf(menuItemData._id)
      const isOpen = (index !== -1 && openState[index]) ? openState[index].isOpen : false

      if (fullpath.length >= 1 && fullpath[fullpath.length - 1] !== menuItemData.parent_id) {
        fullpath.pop()
      }
      fullpath.push(String(menuItemData._id))
      if (fullpath[1] === "root") fullpath.pop()
      return (
        <DirMenuItem
          handleToggle={() => {
            dispatch({ id: menuItemData._id, isOpen: !isOpen, index: index })
            setFire(fire => !fire)
          }}
          isOpen={isOpen}
          isParent={menuItemData.children.length > 0}
          name={menuItemData.dirname}
          id={menuItemData._id}
          dense={false}
          children={dirMenuItems(menuItemData.children)}
        />
      );
    });
  }, [state, fire])
  const value = {
    fire: getdirFire,
    setFire: setGetdirFire
  }
  return (
    <FireContext.Provider value={value}>
      <Menu>
        {dirMenuItems(state)}
      </Menu>
    </FireContext.Provider>

  )
}

export default DirMenu