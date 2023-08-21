import * as React from 'react';
import {
  useDataProvider,
  useTranslate,
  useNotify
} from 'react-admin';
import {
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
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
  const name = useWatch({ name:"NameInputField" , control: control });
  const isSet = name ? true : false
  const onCancel = () => setOpen(false)
  const onSubmit = (data: any) => {
    dataProvider.mkdir(dirId, { dirname: data.NameInputField }).then((response: Response) => {
      if (response.status === 400) {
        notify('error.dirAlreadyExist', { type: 'error', messageArgs: { code: response.status, text: response.statusText } })
      }
      else if (response.status < 200 || response.status >= 300) {
        notify('file.statusCodeError', { type: 'error', messageArgs: { code: response.status, text: response.statusText } })
      }
      setFire(fire => !fire)
    })
  }
  return (
    <>
      <IconButton
        color="primary"
        onClick={() => setOpen(true)}
        children={<CreateNewFolderIcon />}
        size="small"
      />
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
          <DialogTitle>
            {translate('dir.mkdir.title')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {translate('dir.mkdir.context', {name: dirName})}
            </DialogContentText>
            <NameInputField control={control} />
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              onClick={() => {
                setOpen(false);
              }}
              disabled={!isSet}
            >
              {translate('dir.create')}
            </Button>
            <Button
            color="inherit"
              onClick={onCancel}
            >
              {translate('ra.action.cancel')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}