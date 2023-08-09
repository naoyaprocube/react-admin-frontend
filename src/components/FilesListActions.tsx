import {
  useTranslate,
  TopToolbar,
  CreateButton,
} from 'react-admin';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
const FilesListActions = (props: any) => {
  const translate = useTranslate()
  return (
    <TopToolbar>
      <CreateButton 
      icon={<NoteAddIcon/>}
      label={translate('file.upload')}
      />
    </TopToolbar>

  )
}
export default FilesListActions;