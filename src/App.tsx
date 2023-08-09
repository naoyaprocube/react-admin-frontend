import { Admin, Resource, Layout, defaultTheme, CustomRoutes } from 'react-admin';
import FileProvider from './dataProvider';
import FilesList from './components/FilesList';
import FileShow from './components/FileShow';
import FilesCreate from './components/FilesCreate';
import { i18nProvider } from './i18nProvider';
import DirMenu from './components/Dirmenu';
import { Routes, Route, } from 'react-router-dom';

const FileLayout = (props: any) => {
  return (
    <Layout {...props} menu={DirMenu} />
  )
}

const theme = {
  ...defaultTheme,
  sidebar: {
    width: 300, // The default value is 240
    closedWidth: 100, // The default value is 55
  },
};

function App() {
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
