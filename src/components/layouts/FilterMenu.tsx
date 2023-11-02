import * as React from 'react';
import {
  SavedQueriesList,
  FilterLiveSearch,
  FilterList,
  FilterListItem,
  useDataProvider,
} from 'react-admin';
import {
  Card,
  CardContent,
} from '@mui/material';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';

export const ConnectionFilterMenu = (params: any) => {
  const { workId } = params
  const [parentList, setParentList] = React.useState([])
  const dataProvider = useDataProvider()
  React.useEffect(() => {
    dataProvider.getParentList("connections/" + workId).then((response: any) => {
      setParentList(response)
    })
  }, [])
  return (
    <Card sx={{ order: -1, mt: 1, mr: 2, minWidth: 300, height: '100%' }}>
      <CardContent>
        <SavedQueriesList />
        <FilterLiveSearch fullWidth />
        <FilterList label="guacamole.filter.protocol.name" icon={<SettingsInputComponentIcon />}>
          <FilterListItem label="guacamole.filter.protocol.vnc" value={{ protocol: 'vnc' }} />
          <FilterListItem label="guacamole.filter.protocol.telnet" value={{ protocol: 'telnet' }} />
          <FilterListItem label="guacamole.filter.protocol.ssh" value={{ protocol: 'ssh' }} />
          <FilterListItem label="guacamole.filter.protocol.rdp" value={{ protocol: 'rdp' }} />
        </FilterList>
        <FilterList label="guacamole.filter.parent.name" icon={<DevicesOtherIcon />}>
          {parentList.map((parent: string) => {
            return <FilterListItem label={parent} value={{ parent: parent }} />
          })}
        </FilterList>
      </CardContent>
    </Card>
  )
};

export const HistoryFilterMenu = () => (
  <Card sx={{ order: -1, mt: 1, mr: 2, minWidth: 300, height: '100%' }}>
    <CardContent>
      <SavedQueriesList />
      <FilterLiveSearch fullWidth />
      <FilterList label="guacamole.filter.duration.name" icon={<TimelapseIcon />}>
        <FilterListItem label="guacamole.filter.duration.30s" value={{ duration: 1000 * 30 }} />
        <FilterListItem label="guacamole.filter.duration.5m" value={{ duration: 1000 * 60 * 5 }} />
        <FilterListItem label="guacamole.filter.duration.1h" value={{ duration: 1000 * 60 * 60 }} />
      </FilterList>
      <FilterList label="guacamole.filter.startTime.name" icon={<AccessTimeIcon />}>
        <FilterListItem label="guacamole.filter.startTime.day" value={{ startTime: 1000 * 60 * 60 * 24 }} />
        <FilterListItem label="guacamole.filter.startTime.week" value={{ startTime: 1000 * 60 * 60 * 24 * 7 }} />
        <FilterListItem label="guacamole.filter.startTime.month" value={{ startTime: 1000 * 60 * 60 * 24 * 30 }} />
      </FilterList>
    </CardContent>
  </Card>
);

export const WorkFilterMenu = () => (
  <Card sx={{ order: -1, mt: 1, mr: 2, minWidth: 300, height: '100%' }}>
    <CardContent>
      <SavedQueriesList />
      <FilterLiveSearch fullWidth />
      <FilterList label="guacamole.filter.work.name" icon={<WorkspacesIcon />} sx={{
        "&& .Before": {
          backgroundColor: "#c5e1a5",
          borderRadius: 3,
          border: 1,
          mb: 0.5,
        },
        "&& .Now": {
          backgroundColor: "#80deea",
          borderRadius: 3,
          border: 1,
          mb: 0.5,
        },
        "&& .Out": {
          backgroundColor: "#fff59d",
          borderRadius: 3,
          border: 1,
          mb: 0.5,
        },
        "&& .After": {
          backgroundColor: "#ef9a9a",
          borderRadius: 3,
          border: 1,
          mb: 0.5,
        },
      }}>
        <FilterListItem label="guacamole.filter.work.before" value={{ workStatus: "before" }} className="Before" />
        <FilterListItem label="guacamole.filter.work.now" value={{ workStatus: "now" }} className="Now" />
        <FilterListItem label="guacamole.filter.work.out" value={{ workStatus: "out" }} className="Out" />
        <FilterListItem label="guacamole.filter.work.after" value={{ workStatus: "after" }} className="After" />
      </FilterList>
    </CardContent>
  </Card>
);