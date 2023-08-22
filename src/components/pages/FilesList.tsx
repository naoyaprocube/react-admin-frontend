
import * as React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DeleteWithConfirmButton,
  ShowButton,
  FunctionField,
  DateField,
  useRecordContext,
  TopToolbar,
  CreateButton,
  useTranslate,
  useDataProvider,
  DatagridBody,
  RecordContextProvider,
} from 'react-admin';
import {
  Box,
  Tooltip,
  Typography,
  TableRow,
  TableCell,
  Checkbox,
  ButtonGroup
} from '@mui/material';
import { blue } from '@mui/material/colors';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { humanFileSize } from '../utils'
import { DirRoute } from '../layouts/DirRoute'
import DownloadButton from '../buttons/DownloadButton'
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { useParams } from "react-router-dom";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';


const FilesList = (props: any) => {
  const { id } = useParams()
  const dataProvider = useDataProvider()
  const translate = useTranslate()
  const [dir, setDir] = React.useState({ dirname: "root", _id: "root", fullpath: [] });
  React.useEffect(() => {
    dataProvider.getdir({ id: id }).then((result: any) => {
      const json = JSON.parse(result.body)
      setDir(json)
    })
  }, [id])

  const DeleteButton = () => {
    const record = useRecordContext()
    const { id } = useParams()
    return <Tooltip title={translate('ra.action.delete')} placement="top-start">
      <Box>
        <DeleteWithConfirmButton label="" redirect={"/dirs/" + id} translateOptions={{ id: record.filename }} />
      </Box>
    </Tooltip>
  }
  const FileShowButton = () => (
    <Tooltip title={translate('file.infoIcon')} placement="top-start">
      <Box>
        <ShowButton label="" icon={<InfoOutlinedIcon />} />
      </Box>
    </Tooltip>
  )
  const FilesListActions = (props: any) => {
    return (
      <TopToolbar sx={{ width: 1 }}>
        <DirRoute dir={dir} />
        <CreateButton
          icon={<NoteAddIcon />}
          label={translate('file.upload')}
        />
      </TopToolbar>
    )
  }
  const Empty = () => (
    <Box sx={{ mt: 5 }} width={1}>
      <Box width={1} sx={{
        display: 'flex',
        justifyContent: 'space-evenly',
        mt: 1
      }}>
        <FolderOpenIcon sx={{
          width: '9em',
          height: '9em',
          color: 'text.secondary',
        }} />
      </Box>

      <Typography variant="h4" align="center" sx={{ color: 'text.secondary' }}>
        {translate('ra.page.empty')}
      </Typography>
      <Typography variant="body1" align="center" sx={{ mt: 3, color: 'text.secondary' }}>
        {translate('ra.page.invite')}
      </Typography>
      <Box width={1} sx={{
        display: 'flex',
        justifyContent: 'space-evenly',
        mt: 1
      }}>
        <CreateButton
          icon={<NoteAddIcon />}
          label={translate('file.upload')}
          size="large"
        />
      </Box>

    </Box>
  );

  const CustomDatagridRow = ({ record, resource, id, onToggleItem, children, selected, basePath, selectable }: any) => (
    <RecordContextProvider value={record}>
      <TableRow key={id}>
        <TableCell style={{ width: "5%" }} padding="none">
          {selectable && (
            <Checkbox
              sx={{ display: "inline-flex", justifyContent: 'row', ml:1}}
              checked={selected}
              onClick={event => onToggleItem(id, event)}
            />
          )}
        </TableCell>
        {React.Children.map(children, field => (
          <TableCell sx={{ overflow: "auto" }} style={{ width: field.props.width, maxWidth: 300 }} key={`${id}-${field.props.source}`}>
            {React.cloneElement(field, {
              record,
              basePath,
              resource,
            })}
          </TableCell>
        ))}

      </TableRow>
    </RecordContextProvider>
  );
  const CustomDatagridBody = (props: any) => <DatagridBody {...props} row={<CustomDatagridRow />} />;
  const CustomDatagrid = (props: any) => <Datagrid {...props} body={<CustomDatagridBody />} />;
  return (
    <List {...props} title={dir.dirname} empty={<Empty />} resource={id} exporter={false} actions={<FilesListActions />}>
      <CustomDatagrid style={{ tableLayout: "initial" }}>
        <TextField width="50%" source="filename" label="file.fields.filename" sortable={false} className={"filename"} sx={{ width: 1, }} />
        <FunctionField width="10%" source="length" label="file.fields.length" sortable={true} sortBy="length" render={(record: any) => humanFileSize(record.length, false)} />
        <DateField width="10%" source="uploadDate" label="file.fields.uploadDate" showTime locales="jp-JP" />
        <TextField width="10%" source="metadata.status" label="file.fields.metadata.status" sortable={false} />
        <ButtonGroup variant="text" className="ActionButtons" sx={{ display: 'inline-flex' }}>
          <DownloadButton />
          <FileShowButton />
          <DeleteButton />
        </ButtonGroup>
      </CustomDatagrid>
    </List>
  );
};

export default FilesList;