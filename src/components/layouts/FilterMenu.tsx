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

export const WorkFilterMenu = () => (
  <Card sx={{ order: -1, mt: 1, mr: 2, width: 300, height: '100%' }}>
        <CardContent>
            <SavedQueriesList />
            <FilterLiveSearch />
            <FilterList label="作業状態" icon={<AccessTimeIcon />}>
                <FilterListItem label="開始前" value={{ duration: 1000 * 30 }} />
                <FilterListItem label="現在進行中" value={{ duration: 1000 * 60 * 5 }} />
                <FilterListItem label="作業時間外" value={{ duration: 1000 * 60 * 60 }} />
            </FilterList>
        </CardContent>
    </Card>
);