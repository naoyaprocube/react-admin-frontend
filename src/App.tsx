import { Admin, Resource, Layout, Menu } from 'react-admin';
import FileProvider from './dataProvider';
import FilesList from './components/FilesList';
import FileShow from './components/FileShow';
import FilesCreate from './components/FilesCreate';
import { i18nProvider } from './i18nProvider';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
const FileLayout = (props: any) => <Layout {...props} />;


function App() {
  return (
    <Admin dataProvider={FileProvider} i18nProvider={i18nProvider} layout={FileLayout} title="File Server">
      <Resource
        name="root"
        list={FilesList}
        show={FileShow}
        create={FilesCreate}
        icon={FolderOpenIcon}
      />
    </Admin>
  );
}

export default App;
