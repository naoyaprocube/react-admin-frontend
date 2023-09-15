import {
  Menu,
  useDataProvider,
  useTranslate,
  useNotify,
} from 'react-admin';

export const GuacMenu = () => (
  <Menu>
      <Menu.Item to="/files/root" primaryText="FileServer"/>
  </Menu>
);