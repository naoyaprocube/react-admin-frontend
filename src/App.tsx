import * as React from 'react';
import {
  Admin,
  Resource,
  Layout,
  defaultTheme,
  combineDataProviders,
} from 'react-admin';
import { colors, Box } from '@mui/material';
import { Route, } from 'react-router-dom';
import {
  FileProvider,
  ConnectProvider,
  HistoryProvider,
  WorkProvider,
  AnnounceProvider,
  SFTPProvider,
} from './dataProvider';
import authProvider from './authProvider';
import FilesList from './components/pages/FilesList';
import FileShow from './components/pages/FileShow';
import FilesCreate from './components/pages/FilesCreate';
import ConnectionsList from './components/pages/ConnectionsList';
import SFTPClient from './components/pages/SFTPClient';
import HistoryList from './components/pages/HistoryList';
import Dashboard from './components/pages/Dashboard';
import { i18nProvider } from './i18nProvider';
import { GuacMenu } from './components/layouts/Sidebar';
import { AGAppbar } from './components/layouts/Appbar';

export const LogoBox =() => (
  <Box
    component="img"
    sx={{
      height: 30,
      width: 75,
      p: 0.5,
      m: 0.5,
      border: 1,
      borderRadius: 1,
      bgcolor: "#ffffff"
    }}
    src="https://optage.co.jp/common/img/common/header/logo-optage.png"
  />
)

type AppContext = {
  theme: any,
  setTheme: React.Dispatch<React.SetStateAction<any>>
  token: string,
  setToken: React.Dispatch<React.SetStateAction<string>>
}
export const AppContext = React.createContext({} as AppContext);

export const adminTheme = {
  ...defaultTheme,
  palette: {
    primary: colors.teal,
    secondary: colors.grey
  },
  sidebar: {
    width: 270, // The default value is 240
    closedWidth: 0, // The default value is 55
  },
};
export const workerTheme = {
  ...defaultTheme,
  palette: {
    primary: colors.blue,
    secondary: colors.grey
  },
  sidebar: {
    width: 270, // The default value is 240
    closedWidth: 0, // The default value is 55
  },
};

const App = () => {
  if (!localStorage.getItem('theme')) localStorage.setItem('theme', "worker")
  const initialTheme = localStorage.getItem('theme') === "admin" ? adminTheme : workerTheme
  const [theme, setTheme] = React.useState(initialTheme)
  const [token, setToken] = React.useState("")
  const layout = (props: any) => {
    return (<>
      <Layout {...props}
        menu={GuacMenu}
        appBar={AGAppbar}
      />
    </>)
  }

  const dataProviders = combineDataProviders((resource: string) => {
    if (resource.startsWith("files")) return FileProvider;
    else if (resource.startsWith("connections")) return ConnectProvider;
    else if (resource.startsWith("history")) return HistoryProvider;
    else if (resource.startsWith("works")) return WorkProvider;
    else if (resource.startsWith("announce")) return AnnounceProvider;
    else if (resource.startsWith("sftp")) return SFTPProvider;
    else return null
  });
  return (
    <AppContext.Provider value={{ theme: theme, setTheme: setTheme, token: token, setToken: setToken }}>
      <Admin
        dataProvider={dataProviders}
        authProvider={authProvider}
        i18nProvider={i18nProvider}
        layout={layout}
        theme={theme}
        dashboard={Dashboard}
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
            <Route path="/:workId/:connectionId/SFTP" element={<SFTPClient />} />
          </>}
        />
        <Resource
          name={"history"}
          children={<>
            <Route path="/:workId" element={<HistoryList />} />
          </>}
        />
      </Admin>
    </AppContext.Provider>
  );
}

export default App;
