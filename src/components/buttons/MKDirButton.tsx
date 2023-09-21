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
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { FireContext } from '../layouts/Dirmenu'

interface MKDProps {
  sidebarIsOpen: boolean;
  dirId: String;
  dirName: String;
}

const NameInputField = ({ control }: any) => {
  return (
    <div>
      <Controller
        control={control}
        name="NameInputField"
        defaultValue={""}
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

export const MKDirButton = (props: MKDProps) => {
  const { sidebarIsOpen, dirId, dirName } = props;
  const { control, handleSubmit } = useForm({
    mode: "onChange"
  });
  const [open, setOpen] = React.useState(false);
  const { fire, setFire } = React.useContext(FireContext);
  const notify = useNotify()
  const dataProvider = useDataProvider()
  const translate = useTranslate()
  const name = useWatch({ name: "NameInputField", control: control });
  const isSet = name ? true : false
  const onSubmit = (data: any) => {
    dataProvider.mkdir("files/" + dirId, { dirname: data.NameInputField }).then((response: Response) => {
      if (response.status < 200 || response.status >= 300) {
        if(response.statusText) notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.statusText } })
        else notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: "Error" } })
      }
      if(response.status === 200) {
        notify('file.statusCodeError', { type: 'warning', messageArgs: { code: response.status, text: response.body } })
      }
      setFire(fire => !fire)
      setOpen(false)
    })
    .catch((response: any) => {
      notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.message } })
    })
  }
  return React.useMemo(() => (
    <MenuItem disabled={open} onClick={() => { if (!open) setOpen(true) }}>
      <CreateNewFolderIcon color="primary" fontSize="small" />
      <Typography variant="body2" fontSize={15} sx={{ ml: 1 }}>
        {translate('dir.mkdir.create')}
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
            <CreateNewFolderIcon color="primary" fontSize="large" sx={{ mr: 1}} />
            <Box>
              {translate('dir.mkdir.title')}
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {translate('dir.mkdir.content', { name: dirName })}
            </DialogContentText>
            <NameInputField control={control} />
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              onClick={() => setOpen(false)}
              disabled={!isSet}
            >
              {translate('dir.create')}
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
  ), [open, isSet])
}