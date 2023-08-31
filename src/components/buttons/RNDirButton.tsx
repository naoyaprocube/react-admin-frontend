import * as React from 'react';
import {
  useDataProvider,
  useTranslate,
  useNotify
} from 'react-admin';
import {
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
  Typography,
} from '@mui/material';
import { useWatch } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { FireContext } from '../layouts/Dirmenu'

interface RNDProps {
  isRoot: boolean;
  dirId: String;
  dirName: String;
}

const NameInputField = ({ control, val}:any) => {
  return (
    <div>
      <Controller
        control={control}
        name="NameInputField"
        defaultValue={val}
        render={({ field: { onChange, value } }) => (
          <TextField
            autoFocus
            margin="dense"
            id="dirname"
            fullWidth
            variant="standard"
            value={value}
            onChange={onChange}
            InputLabelProps={{ shrink: true }}
          />
        )}
      />
    </div>
  );
};

export const RNDirButton = (props: RNDProps) => {
  const { isRoot, dirId, dirName } = props;
  const { control, handleSubmit } = useForm({
    mode: "onChange"
  });
  const [open, setOpen] = React.useState(false);
  const { fire, setFire } = React.useContext(FireContext);
  const notify = useNotify()
  const dataProvider = useDataProvider()
  const translate = useTranslate()
  const name = useWatch({ name: "NameInputField", control: control });
  const isSet = (name && name !== dirName) ? true : false
  
  const onSubmit = (data: any) => {
    dataProvider.rndir(dirId, { dirname: data.NameInputField }).then((response: Response) => {
      if (response.status < 200 || response.status >= 300) {
        if(response.statusText) notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.statusText } })
        else notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: "Error" } })
      }
      else if (response.status === 200) {
        notify('file.statusCodeError', { type: 'warning', messageArgs: { code: response.status, text: response.body } })
      }
      setFire(fire => !fire)
      setOpen(false)
    }).catch((response: any) => {
      notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.message } })
    })
  }
  if(!isRoot) return null
  return (
    <MenuItem disabled={open} onClick={() => { if (!open) setOpen(true) }}>
      <DriveFileRenameOutlineIcon color="primary" fontSize="small" />
      <Typography variant="body2" fontSize={15} sx={{ ml: 1 }}>
        {translate('dir.rndir.rename')}
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
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogTitle sx={{display: "flex"}}>
            <DriveFileRenameOutlineIcon color="primary" fontSize="large" sx={{ mr: 1}} />
            <Box>
              {translate('dir.rndir.title', { dirName: dirName })}
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {translate('dir.rndir.content', { name: dirName })}
            </DialogContentText>
            <NameInputField control={control} val={dirName}/>
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              onClick={() => setOpen(false)}
              disabled={!isSet}
            >
              {translate('dir.rename')}
            </Button>
            <Button
              type="button"
              color="inherit"
              onClick={() => setOpen(false)}
            >
              {translate('ra.action.cancel')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </MenuItem>
  )
}