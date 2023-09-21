import { SavedQueriesList, FilterLiveSearch, FilterList, FilterListItem } from 'react-admin';
import { Card, CardContent } from '@mui/material';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
export const FilterMenu = () => (
  <Card sx={{ order: -1, mt: 4, mr: 2, width: 300, height: '100%' }}>
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