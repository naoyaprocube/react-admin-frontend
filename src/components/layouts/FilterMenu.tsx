import { SavedQueriesList, FilterLiveSearch, FilterList, FilterListItem } from 'react-admin';
import { Card, CardContent } from '@mui/material';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import TimelapseIcon from '@mui/icons-material/Timelapse';

export const ConnectionFilterMenu = () => (
  <Card sx={{ order: -1, mt: 1, mr: 2, width: 300, height: '100%' }}>
        <CardContent>
            <SavedQueriesList />
            <FilterLiveSearch />
            <FilterList label="Protocol" icon={<SettingsInputComponentIcon />}>
                <FilterListItem label="VNC" value={{ protocol: 'vnc' }} />
                <FilterListItem label="SSH" value={{ protocol: 'ssh' }} />
                <FilterListItem label="RDP" value={{ protocol: 'rdp' }} />
            </FilterList>
        </CardContent>
    </Card>
);

export const HistoryFilterMenu = () => (
  <Card sx={{ order: -1, mt: 1, mr: 2, width: 300, height: '100%' }}>
        <CardContent>
            <SavedQueriesList />
            <FilterLiveSearch />
            <FilterList label="Duration" icon={<TimelapseIcon />}>
                <FilterListItem label="30 seconds" value={{ duration: 1000 * 30 }} />
                <FilterListItem label="5 minutes" value={{ duration: 1000 * 60 * 5 }} />
                <FilterListItem label="1 hours" value={{ duration: 1000 * 60 * 60 }} />
            </FilterList>
        </CardContent>
    </Card>
);