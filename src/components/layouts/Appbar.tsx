import * as React from 'react';
import { useAccessToken } from '../../tokenProvider'
import {
  AppBar,
  TitlePortal,
  LocalesMenuButton,
  useDataProvider,
  UserMenu,
  useUserMenu,
  useTranslate,
} from 'react-admin';
import { AppContext, workerTheme, adminTheme, LogoBox } from '../../App'
import {
  Box,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import EngineeringIcon from '@mui/icons-material/Engineering';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { useLocation } from "react-router-dom";
import { statusToColor } from "../utils"

export const AGAppbar = () => {

  const { setTheme } = React.useContext(AppContext);
  const [accessToken] = useAccessToken()
  const translate = useTranslate()
  const pathname = useLocation().pathname
  const workId = pathname.split("/")[2]
  const dataProvider = useDataProvider()
  const [work, setWork]: any = React.useState({})
  React.useEffect(() => {
    if (workId === "public" || workId === "all") setWork({})
    else if (workId) dataProvider.getWork("works", { id: workId, token: accessToken }).then((result: any) => {
      setWork(result)
    })
    else setWork({})
  }, [workId])
  const WorkField = (props: any) => {
    if (Object.keys(work).length === 0) return null
    const color = statusToColor(work)
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
          localStorage.setItem('theme', 'worker')
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
          localStorage.setItem('theme', 'admin')
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
      <LogoBox />
      <TitlePortal />
      <WorkField />
    </AppBar >
  )
};