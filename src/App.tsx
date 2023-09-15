import * as React from 'react';
import { Admin, Resource, Sidebar, Layout, defaultTheme, CustomRoutes } from 'react-admin';
import FileProvider from './dataProvider';
import { colors } from '@mui/material';
import FilesList from './components/pages/FilesList';
import FileShow from './components/pages/FileShow';
import FilesCreate from './components/pages/FilesCreate';
import { i18nProvider } from './i18nProvider';
import { GuacMenu } from './guacamole-components/layouts/GuacMenu';
import { Route, } from 'react-router-dom';
const App = () => {
  const theme = {
    ...defaultTheme,
    sidebar: {
      width: 240, // The default value is 240
      closedWidth: 0, // The default value is 55
    },
  };
  const FileLayout = (props: any) => {
    return (<>
      <Layout {...props} menu={GuacMenu} />
    </>)
  }

  return (
    <Admin dataProvider={FileProvider} i18nProvider={i18nProvider} layout={FileLayout} theme={theme} title="File Server">
      <Resource
        name={"files"}
        children={<>
          <Route path="/" element={<FilesList />} />
          <Route path="/:dirId" element={<FilesList />} />
        </>}
      />
      <CustomRoutes>
        <Route path="/:id/:fileId/show" element={<FileShow />} />
        <Route path="/:id/create" element={<FilesCreate />} />
      </CustomRoutes>
    </Admin>
  );
}

export default App;
