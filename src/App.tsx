import * as React from 'react';
import { Admin, Resource, Sidebar, Layout, defaultTheme, CustomRoutes } from 'react-admin';
import FileProvider from './dataProvider';
import { colors } from '@mui/material';
import FilesList from './components/pages/FilesList';
import FileShow from './components/pages/FileShow';
import FilesCreate from './components/pages/FilesCreate';
import { i18nProvider } from './i18nProvider';
import DirMenu from './components/layouts/Dirmenu';
import { Route, } from 'react-router-dom';
const App = () => {
  const theme = {
    ...defaultTheme,
    sidebar: {
      width: 250, // The default value is 240
      closedWidth: 110, // The default value is 55
    },
  };
  const FileLayout = (props: any) => {
    return (<>
      <Layout {...props} menu={DirMenu} />
    </>)
  }
  
  return (
    <Admin dataProvider={FileProvider} i18nProvider={i18nProvider} layout={FileLayout} theme={theme} title="File Server">
      <Resource
        name={"dirs"}
        children={<>
          <Route path="/:id" element={<FilesList />} />
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
