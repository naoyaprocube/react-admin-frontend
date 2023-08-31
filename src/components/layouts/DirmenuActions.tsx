import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { MKDirButton } from '../buttons/MKDirButton'
import { RMDirButton } from '../buttons/RMDirButton'
import { RNDirButton } from '../buttons/RNDirButton'

const ITEM_HEIGHT = 48;
interface DMAProps {
  mongoid: string;
  dirName: string;
}
export const DirmenuActions = (props: DMAProps) => {
  const { mongoid, dirName } = props
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    console.log("handleClose")
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
          },
        }}
      >
        <MKDirButton dirId={mongoid} sidebarIsOpen={false} dirName={dirName} />
        <RNDirButton dirId={mongoid} isRoot={mongoid !== "root"} dirName={dirName} />
        <RMDirButton mongoid={mongoid} isRoot={mongoid !== "root"} dirName={dirName} />
      </Menu>
    </div>
  );
}
