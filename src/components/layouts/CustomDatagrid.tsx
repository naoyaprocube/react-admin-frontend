import * as React from "react";
import {
  Datagrid,
  DatagridBody,
  RecordContextProvider,
  DatagridRowProps,
  DatagridBodyProps,
  DatagridProps,
} from "react-admin";
import { TableCell, TableRow, Checkbox, Box } from "@mui/material";
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import TerminalIcon from '@mui/icons-material/Terminal';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const fieldIcon = (field: any, record: any) => {
  if (field.props.className === "filename") return <InsertDriveFileOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
  if (field.props.className === "connectionName") return <TerminalIcon fontSize="small" sx={{ mr: 0.5 }} />
  if (field.props.className === "workName") return <WorkspacesIcon fontSize="small" sx={{ mr: 0.5 }} />
  if (field.props.className === "status" && record.metadata && record.metadata.status === "COMPLETE") return <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
  else return null
}
const MyDatagridRow = ({
  record,
  id,
  onToggleItem,
  children,
  selected,
  selectable,
  hasBulkActions,
}: DatagridRowProps) =>
  id ? (
    <RecordContextProvider value={record}>
      <TableRow>
        {/* first column: selection checkbox */}
        {!hasBulkActions ? null :
          <TableCell padding="none">
            {selectable && (
              <Checkbox
                checked={selected}
                onClick={(event) => {
                  if (onToggleItem) {
                    onToggleItem(id, event);
                  }
                }}
                sx={{ display: "inline-flex", justifyContent: 'row', ml: 1 }}
              />
            )}
          </TableCell>
        }
        {/* data columns based on children */}
        {React.Children.map(children, (field: any) =>
          <TableCell
            sx={{
              overflow: "auto",
              verticalAlign: (
                field.props.className === "ConnectionField"
                || field.props.className === "DurationField"
              ) ? 'top' : 'center'
            }}
            style={{
              width: field.props.width,
            }}
            key={`${id}-${field.props.source}`}
          >
            <Box sx={{ display: "flex" }}>
              {fieldIcon(field, record)}
              {field}
            </Box>

          </TableCell>
        )}
      </TableRow>
    </RecordContextProvider>
  ) : null;

const MyDatagridBody = (props: DatagridBodyProps) => (
  <DatagridBody {...props} row={<MyDatagridRow />} />
);
export const CustomDatagrid = (props: DatagridProps) => (
  <Datagrid {...props} body={<MyDatagridBody />} />
);