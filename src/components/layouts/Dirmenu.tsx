import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import {
  List,
  MenuItem,
  Box,
  Collapse,
  Tooltip,
  Typography,
  IconButton,
  ButtonGroup,
  Card,
  CardContent,
} from '@mui/material';
import {
  Menu,
  useDataProvider,
  useTranslate,
  useNotify,
} from 'react-admin';
import { useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { DirmenuActions } from './DirmenuActions';
interface Props {
  dense: boolean;
  handleToggle: () => void;
  isOpen: boolean;
  isParent: boolean;
  name: string;
  id: string;
  children: ReactNode;
}
interface MenuProps {
  workId: string
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

const DirMenu = (props: MenuProps) => {
  const { workId } = props
  const [state, setState] = React.useState([{ _id: "root", dirname: "root", children: [], fullpath: [] }]);
  const [openState, dispatch] = React.useReducer(reducerFunc, initialState)
  const [activeDir, setActiveDir] = React.useState({
    dirname: "",
    dirId: ""
  })
  const dataProvider = useDataProvider()
  const navigate = useNavigate()
  const translate = useTranslate()
  const notify = useNotify()
  const [fire, setFire] = React.useState<boolean>(false);
  const [getdirFire, setGetdirFire] = React.useState<boolean>(false);

  React.useEffect(() => {
    dataProvider.getdirs("files/" + workId).then((result: any) => {
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
    }).catch((response: any) => {
      notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.message } })
    })
  }, [getdirFire])

  const DirMenuItem = React.useCallback((props: Props) => {
    const { handleToggle, isOpen, name, id, isParent, children, dense } = props;
    const isActive = (activeDir.dirId === id)
    const ItemIcon = () => {
      const buttonIcon = <>
        {isParent ?
          isOpen ? <><KeyboardArrowDownIcon fontSize="small" /><FolderOpenIcon /></>
            : <><KeyboardArrowRightIcon fontSize="small" /><FolderIcon /></>
          : <><KeyboardArrowDownIcon fontSize="small" /><FolderOpenIcon /></>
        }
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
        sx={{
          borderRadius: 5,
          bgcolor: isActive ? "primary.light" : null,
          color: isActive ? "primary.contrastText" : null,
        }}
      >
        <ItemIcon />
        <MenuItem
          dense={dense}
          sx={{ ml: -1.2, width: 1, overflow: 'auto', borderRadius: 5 }}
          onClick={() => {
            dataProvider.getdir("files", { id: id })
              .then((result: any) => JSON.parse(result.body))
              .then((json: any) => {
                setActiveDir({
                  dirname: json.dirname,
                  dirId: json._id
                })
                navigate("/files/" + workId + "/" + id)
              })
              .catch((response: any) => {
                notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.message } })
              })
          }}
          disableRipple
        >
          {name}
        </MenuItem>
        {(isActive) ? <DirmenuActions mongoid={id} dirName={name} isRoot={id !== workId}/> : null}
      </ButtonGroup>
    )
    return (
      <div>
        {
          header
        }
        <Collapse in={isOpen} timeout="auto" >
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
  }, [activeDir]);

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
  }, [state, fire, activeDir])
  return (
    <FireContext.Provider value={{ fire: getdirFire, setFire: setGetdirFire }}>
      <Card sx={{ order: -1, mt: 4, mr: 2, width: 300, height: '100%' }}>
        <CardContent>
          <Box sx={{ ml: 2, display: "flex" }}>
            <FolderSharedIcon color="secondary" />
            <Typography variant="body2" sx={{ ml: 1,}}>
              {translate('dir.dirs')}
            </Typography>
          </Box>

          {dirMenuItems(state)}
        </CardContent>
      </Card>
    </FireContext.Provider>
  )
}

export default DirMenu