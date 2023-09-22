import * as React from 'react';
import {
  Admin,
  Resource,
  Layout,
  defaultTheme,
  AppBar,
  ToggleThemeButton,
  combineDataProviders,
} from 'react-admin';
import {
  dataProvider,
  FileProvider,
  ConnectProvider,
  HistoryProvider,
} from './dataProvider';
import authProvider from './authProvider';
import { colors } from '@mui/material';
import FilesList from './components/pages/FilesList';
import FileShow from './components/pages/FileShow';
import FilesCreate from './components/pages/FilesCreate';
import ConnectionsList from './components/pages/ConnectionsList';
import HistoryList from './components/pages/HistoryList';
import { i18nProvider } from './i18nProvider';
import { GuacMenu } from './components/layouts/Sidebar';
import { Route, } from 'react-router-dom';

const App = () => {
  const theme = {
    ...defaultTheme,
    palette: {
      primary: colors.orange,
      secondary: colors.purple,
    },
    sidebar: {
      width: 240, // The default value is 240
      closedWidth: 0, // The default value is 55
    },
  };
  const layout = (props: any) => {
    return (<>
      <Layout {...props}
        menu={GuacMenu}
      />
    </>)
  }

  const dataProviders = combineDataProviders((resource: string) => {
    if (resource.startsWith("files")) return FileProvider;
    else if (resource.startsWith("connections")) return ConnectProvider;
    else if (resource.startsWith("history")) return HistoryProvider;
    else return dataProvider
  });
  return (
    <Admin
      dataProvider={dataProviders}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      layout={layout}
      theme={theme}
      title="File Server"
    >
      <Resource
        name={"files"}
        children={<>
          <Route path="/:workId" element={<FilesList />} />
          <Route path="/:workId/:dirId" element={<FilesList />} />
          <Route path="/:workId/:dirId/:fileId/show" element={<FileShow />} />
          <Route path="/:workId/:dirId/create" element={<FilesCreate />} />
        </>}
      />
      <Resource
        name={"connections"}
        children={<>
          <Route path="/:workId" element={<ConnectionsList />} />
        </>}
      />
      <Resource
        name={"history"}
        children={<>
          <Route path="/:workId" element={<HistoryList />} />
        </>}
      />
    </Admin>
  );
}

export default App;
