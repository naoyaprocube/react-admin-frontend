import * as React from "react";
import {
  Datagrid,
  DatagridBody,
  RecordContextProvider,
  DatagridRowProps,
  DatagridBodyProps,
  DatagridProps,
} from "react-admin";
import { TableCell, TableRow, Checkbox } from "@mui/material";
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
          <TableCell padding="none"
            style={{
              width: "0%",
            }}>
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
            {field}
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