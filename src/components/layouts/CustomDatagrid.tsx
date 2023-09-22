
import * as React from 'react';
import {
  Datagrid,
  DatagridBody,
  RecordContextProvider,
} from 'react-admin';
import {
  TableRow,
  TableCell,
  Checkbox
} from '@mui/material';
const CustomDatagridRow = ({ record, resource, id, onToggleItem, children, selected, basePath, selectable }: any) => (
  <RecordContextProvider value={record}>
    <TableRow key={id}>
      <TableCell style={{ width: "5%" }} padding="none">
        {selectable && (
          <Checkbox
            sx={{ display: "inline-flex", justifyContent: 'row', ml: 1 }}
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
export const CustomDatagrid = (props: any) => <Datagrid {...props} body={<CustomDatagridBody />} />;