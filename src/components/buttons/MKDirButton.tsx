import * as React from 'react';
import {
  useDataProvider,
  useTranslate,
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
import { Controller, useForm } from 'react-hook-form';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { FireContext } from '../layouts/Dirmenu'

interface MKDProps {
  sidebarIsOpen: boolean;
  dirId: String;
  dirName: String;
}

const NameInputField = ({ control }: any) => {
  const translate = useTranslate()
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
  const dataProvider = useDataProvider()
  const translate = useTranslate()
  const onCancel = () => setOpen(false)
  const onSubmit = (data: any) => {
    dataProvider.mkdir(dirId, { dirname: data.NameInputField }).then(() => {
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