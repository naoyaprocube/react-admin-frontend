import { SavedQueriesList, FilterLiveSearch, FilterList, FilterListItem } from 'react-admin';
import { Card, CardContent } from '@mui/material';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export const ConnectionFilterMenu = () => (
  <Card sx={{ order: -1, mt: 1, mr: 2, width: 300, height: '100%' }}>
        <CardContent>
            <SavedQueriesList />
            <FilterLiveSearch />
            <FilterList label="guacamole.filter.protocol.name" icon={<SettingsInputComponentIcon />}>
                <FilterListItem label="guacamole.filter.protocol.vnc" value={{ protocol: 'vnc' }} />
                <FilterListItem label="guacamole.filter.protocol.ssh" value={{ protocol: 'ssh' }} />
                <FilterListItem label="guacamole.filter.protocol.rdp" value={{ protocol: 'rdp' }} />
            </FilterList>
        </CardContent>
    </Card>
);

export const HistoryFilterMenu = () => (
  <Card sx={{ order: -1, mt: 1, mr: 2, width: 300, height: '100%' }}>
        <CardContent>
            <SavedQueriesList />
            <FilterLiveSearch />
            <FilterList label="guacamole.filter.duration.name" icon={<TimelapseIcon />}>
                <FilterListItem label="guacamole.filter.duration.30s" value={{ duration: 1000 * 30 }} />
                <FilterListItem label="guacamole.filter.duration.5m" value={{ duration: 1000 * 60 * 5 }} />
                <FilterListItem label="guacamole.filter.duration.1h" value={{ duration: 1000 * 60 * 60 }} />
            </FilterList>
        </CardContent>
    </Card>
);

export const WorkFilterMenu = () => (
  <Card sx={{ order: -1, mt: 1, mr: 2, width: 300, height: '100%' }}>
        <CardContent>
            <SavedQueriesList />
            <FilterLiveSearch />
            <FilterList label="guacamole.filter.work.name" icon={<AccessTimeIcon />}>
                <FilterListItem label="guacamole.filter.work.before" value={{ workStatus:"before" }} />
                <FilterListItem label="guacamole.filter.work.now" value={{ workStatus: "now" }} />
                <FilterListItem label="guacamole.filter.work.out" value={{ workStatus: "out" }} />
            </FilterList>
        </CardContent>
    </Card>
);