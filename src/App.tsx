import * as React from 'react';
import {
  Admin,
  Resource,
  Layout,
  defaultTheme,
  combineDataProviders,
} from 'react-admin';
import {
  FileProvider,
  ConnectProvider,
  HistoryProvider,
  WorkProvider,
  AnnounceProvider,
} from './dataProvider';
import authProvider from './authProvider';
import { colors } from '@mui/material';
import FilesList from './components/pages/FilesList';
import FileShow from './components/pages/FileShow';
import FilesCreate from './components/pages/FilesCreate';
import ConnectionsList from './components/pages/ConnectionsList';
import HistoryList from './components/pages/HistoryList';
import Dashboard from './components/pages/Dashboard';
import { i18nProvider } from './i18nProvider';
import { GuacMenu } from './components/layouts/Sidebar';
import { AGAppbar } from './components/layouts/Appbar';
import { Route, } from 'react-router-dom';
import { useCookies } from 'react-cookie';

type TThemeContext = {
  theme: any,
  setTheme: React.Dispatch<React.SetStateAction<any>>
}
export const ThemeContext = React.createContext({} as TThemeContext);

export const adminTheme = {
  ...defaultTheme,
  palette: {
    primary: colors.teal,
    secondary: colors.teal
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
    secondary: colors.blue
  },
  sidebar: {
    width: 270, // The default value is 240
    closedWidth: 0, // The default value is 55
  },
};

const App = () => {
  const [cookies, setCookies] = useCookies(["theme"]);
  if(!cookies.theme) setCookies("theme", "worker")
  const initialTheme = cookies.theme === "admin" ? adminTheme : workerTheme
  const [theme, setTheme] = React.useState(initialTheme)
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
    else return null
  });
  return (
    <ThemeContext.Provider value={{ theme: theme, setTheme: setTheme }}>
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
          </>}
        />
        <Resource
          name={"history"}
          children={<>
            <Route path="/:workId" element={<HistoryList />} />
          </>}
        />
      </Admin>
    </ThemeContext.Provider>
  );
}

export default App;
