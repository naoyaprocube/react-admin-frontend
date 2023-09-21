import * as React from 'react';
import { useDataProvider, useTranslate, useNotify } from 'react-admin';
import {
  IconButton,
  Button,
  Box,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { FireContext } from '../layouts/Dirmenu'

interface RMDProps {
  isRoot: boolean;
  mongoid: string;
  dirName: string;
}
export const RMDirButton = (props: RMDProps) => {
  const { mongoid, isRoot, dirName } = props;
  const [open, setOpen] = React.useState(false);
  const { fire, setFire } = React.useContext(FireContext);
  const notify = useNotify()
  const dataProvider = useDataProvider();
  const translate = useTranslate()
  if (!isRoot) return null
  const removeHandle = () => dataProvider.rmdir("files",{ id: mongoid }).then((result: any) => {
    setOpen(false)
    setFire(fire => !fire)
  }).catch((response: any) => {
    notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.message } })
  })
  return (<MenuItem disabled={open} onClick={() => { if (!open) setOpen(true) }}>
    <DeleteIcon color="error" fontSize="small" />
    <Typography variant="body2" fontSize={15} sx={{ ml: 1 }}>
      {translate('dir.rmdir.delete')}
    </Typography>
    <Dialog
      open={open}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.25)'
        },
      }}
      maxWidth={"xs"}
    >
      <DialogTitle sx={{ display: "flex" }}>
        <DeleteIcon color="error" fontSize="large" sx={{ mr: 1 }} />
        <Box>
          {translate('dir.rmdir.title', { dirName: dirName })}
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {translate('dir.rmdir.content', { name: dirName })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={removeHandle}
          color="error"
        >
          {translate('ra.action.delete')}
        </Button>
        <Button
          type="button"
          color="inherit"
          onClick={() => setOpen(false)}
        >
          {translate('ra.action.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  </MenuItem>)
}