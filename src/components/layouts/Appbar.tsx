import * as React from 'react';
import {
  AppBar,
  TitlePortal,
  LocalesMenuButton,
  Logout,
  defaultTheme,
  UserMenu,
  useUserMenu,
  useTranslate,
} from 'react-admin';
import { ThemeContext, workerTheme, adminTheme } from '../../App'
import { Box, MenuItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useCookies } from 'react-cookie';
import EngineeringIcon from '@mui/icons-material/Engineering';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

export const AGAppbar = () => {

  const { theme, setTheme } = React.useContext(ThemeContext);
  const [cookies, setCookie, removeCookie] = useCookies(["theme"]);
  const translate = useTranslate()
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
        <Box sx={{ml: 2}}>
          <Typography>
            {localStorage.getItem('user')}
          </Typography>
        </Box>
      </>

      }
      userMenu={
        <UserMenu>
          <MenuItems />
          <Logout />
        </UserMenu>
      }
    >
      <TitlePortal />
    </AppBar >
  )
};