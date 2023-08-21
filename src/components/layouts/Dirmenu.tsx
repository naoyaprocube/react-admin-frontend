import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import {
  List,
  MenuItem,
  colors,
  Collapse,
  Tooltip,
  IconButton,
  ButtonGroup
} from '@mui/material';
import {
  Menu,
  useDataProvider,
} from 'react-admin';
import { useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { useTranslate, useSidebarState } from 'react-admin';
import { MKDirButton } from '../buttons/MKDirButton'
import { RMDirButton } from '../buttons/RMDirButton'
interface Props {
  dense: boolean;
  handleToggle: () => void;
  isOpen: boolean;
  isParent: boolean;
  name: string;
  id: string;
  children: ReactNode;
}
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
  const [state, setState] = React.useState([{ _id: "root", dirname: "root", children: [], fullpath: [] }]);
  const [openState, dispatch] = React.useReducer(reducerFunc, initialState)
  const [activeDir, setActiveDir] = React.useState({
    dirname: "",
    dirId: ""
  })
  const dataProvider = useDataProvider()
  const navigate = useNavigate()
  const [sidebarIsOpen] = useSidebarState();

  const [fire, setFire] = React.useState<boolean>(false);
  const [getdirFire, setGetdirFire] = React.useState<boolean>(false);

  React.useEffect(() => {
    dataProvider.getdirs().then((result: any) => {
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

  const DirMenuItem = React.useCallback((props: Props) => {
    const { handleToggle, isOpen, name, id, isParent, children, dense } = props;
    const isActive = (activeDir.dirId === id)
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
      <ButtonGroup
        fullWidth
        variant={isActive ? "contained" : "text"}
        sx={{ borderRadius: 5, bgcolor: isActive ? colors.blue[50] : null }}
      >
        <ItemIcon />
        <MenuItem
          dense={dense}
          sx={{ ml: -1.2, width: 1, borderRadius: 5 }}
          onClick={() => {
            dataProvider.getdir({ id: id })
              .then((result: any) => JSON.parse(result.body))
              .then((json: any) => {
                setActiveDir({
                  dirname: json.dirname,
                  dirId: json._id
                })
                navigate("/dirs/" + id)
              })
          }}
          disableRipple
        >
          {
            sidebarIsOpen ? <>
              {name}
            </> : <ArrowForwardIosIcon color="primary" />
          }
        </MenuItem>
        {isActive ? <>
          <MKDirButton dirId={id} sidebarIsOpen={false} dirName={name} />
          <RMDirButton mongoid={id} isRoot={id !== "root"} dirName={name}/>
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
        <Collapse in={isOpen} timeout="auto" >
          <List
            dense={dense}
            component="div"
            disablePadding
            sx={{
              ml: sidebarIsOpen ? 1.5 : 0.2
            }}
            children={children}
          />
        </Collapse>
      </div>
    );
  },[activeDir,sidebarIsOpen]);

  const dirMenuItems = React.useCallback((menuItems: Array<Object>) => {
    return menuItems.map((menuItemData: any) => {
      const index = openState.map((v: any) => v.id).indexOf(menuItemData._id)
      const isOpen = (index !== -1 && openState[index]) ? openState[index].isOpen : false
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
  }, [state, fire, activeDir, sidebarIsOpen])
  return (
    <FireContext.Provider value={{ fire: getdirFire, setFire: setGetdirFire }}>
      <Menu>
        {dirMenuItems(state)}
      </Menu>
    </FireContext.Provider>
  )
}

export default DirMenu