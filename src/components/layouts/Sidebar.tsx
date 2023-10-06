import * as React from 'react';
import {
  Menu,
  useDataProvider,
  useNotify,
  useTranslate,
  Confirm,
} from 'react-admin';
import {
  List,
  MenuItem,
  Typography,
  Box,
  Collapse,
} from '@mui/material';
import { useCookies } from 'react-cookie';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import HomeIcon from '@mui/icons-material/Home';
import CableIcon from '@mui/icons-material/Cable';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import HistoryIcon from '@mui/icons-material/History';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { stringToColor } from "../utils"

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
  const translate = useTranslate()
  const notify = useNotify()
  const [cookies] = useCookies()
  const [open, setOpen] = React.useState(false);
  const handleClick = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);
  const handleConfirm = () => {
    dataProvider.getenv("files", {}).then((res: any) => {
      setOpen(false);
      return res
    }).then(({ json }: any) => {
      window.open(json.idmUrl, "_blank", "noreferrer")
    })
  };
  React.useEffect(() => {
    dataProvider.getListAll("works").then((result: any) => {
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
    const color = stringToColor(id)
    const ItemIcon = () => (<>
      {isParent ?
        isOpen ? <><KeyboardArrowDownIcon sx={{ color: "text.secondary" }} fontSize="small" /><WorkspacesIcon sx={{ color: color, stroke: "#000000", strokeWidth: 1 }} /></>
          : <><KeyboardArrowRightIcon sx={{ color: "text.secondary" }} fontSize="small" /><WorkspacesIcon sx={{ color: color, stroke: "#000000", strokeWidth: 1 }} /></>
        : <><KeyboardArrowDownIcon sx={{ color: "text.secondary" }} fontSize="small" /><WorkspacesIcon sx={{ color: color, stroke: "#000000", strokeWidth: 1 }} /></>
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
      const index = openState.map((v: any) => v.id).indexOf(menuItemData.identifier)
      const isOpen = (index !== -1 && openState[index]) ? openState[index].isOpen : false
      return (
        <MenuWorkItem
          handleToggle={() => {
            dispatch({ id: menuItemData.identifier, isOpen: !isOpen, index: index })
            setFire(fire => !fire)
          }}
          isOpen={isOpen}
          isParent={true}
          name={menuItemData.name}
          id={menuItemData.idmIdentifier}
          dense={false}
          children={<Box>
            {cookies.theme === "worker" ?
              <Menu.Item
                to={"/connections/" + menuItemData.idmIdentifier}
                primaryText={
                  <Typography variant="body2">
                    {translate('pages.connectionSelect')}
                  </Typography>
                }
                sx={{ borderRadius: 5, }}
                leftIcon={<CableIcon />}
                key={menuItemData.idmIdentifier + "-connection"}
              /> : null
            }

            <Menu.Item
              to={"/history/" + menuItemData.idmIdentifier}
              primaryText={
                <Typography variant="body2">
                  {translate('pages.connectionHistory')}
                </Typography>
              }
              sx={{ borderRadius: 5, }}
              leftIcon={<HistoryIcon />}
              key={menuItemData.idmIdentifier + "-history"}
            />
            <Menu.Item
              to={"/files/" + menuItemData.idmIdentifier}
              primaryText={
                <Typography variant="body2">
                  {translate('pages.fileManager')}
                </Typography>
              }
              sx={{ borderRadius: 5, }}
              leftIcon={<InsertDriveFileIcon />}
              key={menuItemData.idmIdentifier + "-files"}
            />
          </Box>}
        />
      );
    });
  }, [fire, activeItem])
  return (
    <Menu>
      <Confirm
        isOpen={open}
        title={translate('guacamole.moveWorkflowTitle')}
        content={translate('guacamole.moveWorkflowContent')}
        onConfirm={handleConfirm}
        onClose={handleDialogClose}
        key="confirm"
      />
      <Menu.Item
        to="/"
        primaryText={
          <Typography variant="body2">
            {translate('pages.homepage')}
          </Typography>
        }
        leftIcon={<HomeIcon />}
        key="homepage"
      />
      <MenuItem onClick={handleClick} key="workflow">
        <OpenInNewIcon sx={{ color: "text.secondary" }} />
        <Typography variant="body2" sx={{ ml: 2, color: "text.secondary" }} >
          {translate('pages.workflow')}
        </Typography>
      </MenuItem>
      <Menu.Item
        to="/files/public"
        primaryText={
          <Typography variant="body2">
            {translate('pages.publicFileManager')}
          </Typography>
        }
        leftIcon={<CloudUploadIcon />}
        key="public"
      />
      {cookies.theme === "worker" ? null :
        <Menu.Item
          to="/history/all"
          primaryText={
            <Typography variant="body2">
              {translate('pages.allConnectionHistory')}
            </Typography>
          }
          leftIcon={<HistoryIcon />}
          key="historyAll"
        />
      }

      <Typography variant="body2" sx={{ ml: 1, mt: 1 }} key="textWorks">
        {translate('guacamole.works')}
      </Typography>
      {MenuWorkItems(works)}
    </Menu>
  )
};