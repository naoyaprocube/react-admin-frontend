import * as React from 'react';
import {
  useRecordContext,
  useTranslate
} from 'react-admin';
import {
  IconButton,
  Dialog,
  DialogTitle,
  Box,
  Button,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export const SFTPDeleteButton = (props: any) => {
  const record = useRecordContext()
  const translate = useTranslate()
  const { socket } = props
  const [open, setOpen] = React.useState(false)
  const removeHandle = () => {
    if (record.longname[0] === "-") socket.send(JSON.stringify({
      type: "unlink",
      path: record.id,
    }))
    else if (record.longname[0] === "d") socket.send(JSON.stringify({
      type: "rmdir",
      path: record.id,
    }))
    setOpen(false)
  }
  if (record.filename === "..") return null
  else return (<>
    <IconButton
      color="error"
      size="small"
      children={<DeleteIcon />}
      onClick={() => setOpen(true)}
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
      <DialogTitle sx={{ display: "flex" }}>
        <DeleteIcon color="error" fontSize="large" sx={{ mr: 1 }} />
        <Box>
          {translate('ra.message.delete_title', { id: record.filename })}
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {translate('ra.message.delete_content')}
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
  </>
  )
}