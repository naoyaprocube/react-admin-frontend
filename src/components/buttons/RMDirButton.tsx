import * as React from 'react';
import { useDataProvider, Confirm, useTranslate } from 'react-admin';
import { IconButton } from '@mui/material';
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
  const dataProvider = useDataProvider();
  const translate = useTranslate()
  if (!isRoot) return null
  const removeHandle = () => dataProvider.rmdir({ id: mongoid }).then((result: any) => {
    setOpen(false)
    setFire(fire => !fire)
  })
  return (<>
    <IconButton
      color="error"
      children={<DeleteIcon />}
      size="small"
      onClick={() => setOpen(true)}
    />
    <Confirm
      isOpen={open}
      title={translate('file.rmdir.title', {dirName: dirName})}
      content={translate('file.rmdir.content')}
      onConfirm={removeHandle}
      confirmColor={"secondary"}
      onClose={() => setOpen(false)}
      sx={{
        '& .MuiDialog-paper': {
          width:0.8,
          display: 'flex',
          justifyContent: 'flex-end' 
        },
        '& .MuiDialogActions-root': {
          display: 'flex',
          flexDirection: 'row-reverse',
          justifyContent: 'space-evenly' 
        },
        '& .MuiButtonBase-root': {
          m:1,
          p:1,
          width:0.4,
        },
      }}
    />
  </>)
}