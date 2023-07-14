import React from 'react';
import { Admin, Resource } from 'react-admin';
import myDataProvider from './dataProvider';
import FilesList from './components/ListComponents/FilesList';
import FileShow from './components/ListComponents/FileShow';
import FilesCreate from './components/UploadComponents/FilesCreate';
import { i18nProvider } from './i18nProvider';


function App() {
  return (
    <Admin dataProvider={myDataProvider} i18nProvider={i18nProvider}>
      <Resource
        name="files"
        list={FilesList}
        show={FileShow}
        create={FilesCreate}
      />
    </Admin>
  );
}

export default App;
