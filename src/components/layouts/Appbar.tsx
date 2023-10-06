import * as React from 'react';
import {
  AppBar,
  TitlePortal,
  LocalesMenuButton,
  Logout,
  useDataProvider,
  UserMenu,
  useUserMenu,
  useTranslate,
} from 'react-admin';
import { ThemeContext, workerTheme, adminTheme } from '../../App'
import {
  Box,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  colors
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useCookies } from 'react-cookie';
import EngineeringIcon from '@mui/icons-material/Engineering';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { useLocation } from "react-router-dom";
import { stringToColor } from "../utils"

export const AGAppbar = () => {

  const { theme, setTheme } = React.useContext(ThemeContext);
  const [cookies, setCookie, removeCookie] = useCookies(["theme"]);
  const translate = useTranslate()
  const pathname = useLocation().pathname
  const workId = pathname.split("/")[2]
  const dataProvider = useDataProvider()
  const [work, setWork]: any = React.useState({})
  React.useEffect(() => {
    if (workId === "public" || workId === "all") setWork({})
    else if (workId) dataProvider.getListAll("works").then((result: any) => {
      const filtered = result.data.filter((v: any) => v.idmIdentifier === workId)
      if (filtered.length > 0) setWork(filtered[0])
    })
    else setWork({})
  }, [pathname])
  const WorkField = (props: any) => {
    if (Object.keys(work).length === 0) return null
    const color = stringToColor(work.idmIdentifier)
    return (
      <Box sx={{ display: 'inline-flex', mr: 5 }}>
        <Box sx={{
          display: 'inline-flex',
          border: 1,
          borderRadius: 2,
          borderColor: 'text.primary',
          p: 0.3,
          bgcolor: color
        }}>
          <Typography variant="body2" sx={{ color: "text.primary" }}>
            {work.idmIdentifier}
          </Typography>
        </Box>
        <Typography sx={{ ml: 1 }}>
          {work.name}
        </Typography>
      </Box>

    )
  }
  const MenuItems = () => {
    const { onClose } = useUserMenu();
    return (<>
      <MenuItem
        onClick={() => {
          setTheme(workerTheme)
          setCookie("theme", "worker")
          onClose()
        }}
      >
        <ListItemIcon>
          <EngineeringIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          {translate('guacamole.workerMode')}
        </ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          setTheme(adminTheme)
          setCookie("theme", "admin")
          onClose()
        }}
      >
        <ListItemIcon>
          <SupervisorAccountIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          {translate('guacamole.adminMode')}
        </ListItemText>
      </MenuItem>
    </>)
  };
  return (
    <AppBar
      toolbar={<>
        <LocalesMenuButton />
        <Box sx={{ ml: 2 }}>
          <Typography>
            {localStorage.getItem('user')}
          </Typography>
        </Box>
      </>

      }
      userMenu={
        <UserMenu>
          <MenuItems />
        </UserMenu>
      }
    >
      <TitlePortal />
      <WorkField />
    </AppBar >
  )
};