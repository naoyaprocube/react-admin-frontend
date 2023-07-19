import { Admin, Resource, Layout, Menu } from 'react-admin';
import FileProvider from './dataProvider';
import FilesList from './components/ListComponents/FilesList';
import FileShow from './components/ListComponents/FileShow';
import FilesCreate from './components/UploadComponents/FilesCreate';
import { i18nProvider } from './i18nProvider';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
const FileLayout = (props: any) => <Layout {...props} />;


function App() {
  return (
    <Admin dataProvider={FileProvider} i18nProvider={i18nProvider} layout={FileLayout} title="File Server">
      <Resource
        name="files"
        list={FilesList}
        show={FileShow}
        create={FilesCreate}
        icon={FolderOpenIcon}
      />
    </Admin>
  );
}

export default App;
