import * as React from 'react';
import {
  useDataProvider,
  useTranslate,
} from 'react-admin';
import {
  Box,
  Card,
  IconButton,
  Typography,
  Collapse,
  Grow,
} from '@mui/material';
import { useParams } from "react-router-dom";
import { ConnectButton } from '../buttons/ConnectButton'
import { RMConnectionButton } from '../buttons/RMConnectionButton'
import { FireContext } from '../pages/ConnectionsList'
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export const ActiveConnectionPanel = () => {
  const dataProvider = useDataProvider()
  const [actives, setActives]: any = React.useState([])
  const [open, setOpen]: any = React.useState(false)
  const { workId } = useParams()
  const { fire, setFire } = React.useContext(FireContext);
  const translate = useTranslate()
  React.useEffect(() => {
    dataProvider.getActives("connections").then((result: any) => {
      const sorted = result.sort((a: any, b: any) => {
        return a.startDate - b.startDate
      })
      setActives(sorted)
    })
  }, [fire])
  return (
    <Box sx={{
      width: 1,
      mb: 3,
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: 1,
      }}>
        <Typography sx={{ width: 180, mt: 0.8, height: 30 }}>
          {translate('guacamole.activeSession')}
        </Typography>
        <IconButton sx={{ ml: -1 }} onClick={() => {
          if (!open) setFire(!fire)
          setOpen(!open)
        }}>
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
        <Grow in={open}>
          <IconButton onClick={() => setFire(!fire)}>
            {<RefreshIcon />}
          </IconButton>
        </Grow>
      </Box>
      <Collapse in={open}>
        {actives.length === 0 ?
          <Typography variant="h6" align="center" sx={{ mb: 1 }}>
            {translate('guacamole.noActiveSession')}
          </Typography>
          : <Box sx={{
            display: 'flex',
            width: 1,
            overflow: 'auto',
            flexWrap: 'wrap',
          }}>
            {actives.map((connection: any) => {
              return (<Card sx={{ m: 1, p: 1, width: '30%', overflow: 'auto', }}>
                <Typography variant="body2">
                  {translate('guacamole.field.id')}:{connection.connectionIdentifier}
                </Typography>
                <Typography component="pre" variant="body2">
                  {translate('guacamole.field.startDate')}:{new Date(connection.startDate).toLocaleString("ja-JP")}
                </Typography>
                <ConnectButton
                  id={connection.connectionIdentifier}
                  type="c"
                  workId={workId}
                />
                <RMConnectionButton
                  id={connection.identifier}
                />
              </Card>)
            })}
          </Box>}
      </Collapse>
    </Box>
  )

}