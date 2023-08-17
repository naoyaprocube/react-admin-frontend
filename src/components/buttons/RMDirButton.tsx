import * as React from 'react';
import {
  useNotify,
  useDataProvider,
  useRefresh
} from 'react-admin';
import {
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { FireContext } from '../layouts/Dirmenu'

interface RMDProps {
  isRoot: boolean;
  mongoid: string;
}
export const RMDirButton = (props: RMDProps) => {
  const { mongoid, isRoot } = props;
  const { fire, setFire } = React.useContext(FireContext);
  const dataProvider = useDataProvider();
  if (!isRoot) return null
  const removeHandle = () => dataProvider.rmdir({ id: mongoid }).then((result: any) => {
    setFire(fire => !fire)
  })
  return <IconButton
    color="error"
    children={<DeleteIcon />}
    size="small"
    onClick={removeHandle}
  />
}