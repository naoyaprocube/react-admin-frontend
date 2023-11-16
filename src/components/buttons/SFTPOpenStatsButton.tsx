import * as React from 'react';
import {
  useRecordContext,
  useTranslate,
} from 'react-admin';
import {
  Box,
  Typography,
  IconButton,
  Popover,
  Card,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import dayjs from 'dayjs';

export const SFTPOpenStatsButton = (props: any) => {
  const record = useRecordContext()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const translate = useTranslate()
  const mtime = new Date(record.attrs.mmtime)
  const atime = new Date(record.attrs.amtime)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  if (record.filename === "..") return null
  else return (<Box>
    <IconButton
      aria-label="more"
      id="long-button"
      aria-controls={open ? 'stats' : undefined}
      aria-expanded={open ? 'true' : undefined}
      aria-haspopup="true"
      onClick={handleClick}
      size="small"
      sx={{ ml: 1 }}
      children={<InfoIcon color="info" />}
    />
    <Popover
      id="stats"
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      onClose={handleClose}
    >
      <Card>
        <Box sx={{ borderRadius: 2, display: 'block', backgroundColor: "#cfcfcf", pl: 1, pr: 1, m: 1 }}>
          <Typography>
            {record.longname}
          </Typography>
        </Box>
        <Box sx={{ borderRadius: 2, display: 'block', backgroundColor: "primary.light", pl: 1, pr: 1, m: 1 }}>
          <Typography>
            {translate('file.fields.length')} : {record.attrs.size}
          </Typography>
          <Typography>
            {translate('sftp.fields.mtime')} : {dayjs(mtime).format("YYYY/MM/DD HH:mm:ss")}
          </Typography>
          <Typography>
            {translate('sftp.fields.atime')} :{dayjs(atime).format("YYYY/MM/DD HH:mm:ss")}
          </Typography>
          <Typography>
            {translate('sftp.fields.uid')} : {record.attrs.uid}
          </Typography>
          <Typography>
            {translate('sftp.fields.gid')} : {record.attrs.gid}
          </Typography>
        </Box>
      </Card>
    </Popover>
  </Box>
  )
}
