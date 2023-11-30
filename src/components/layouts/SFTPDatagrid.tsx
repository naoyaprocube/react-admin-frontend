import * as React from "react";
import {
  Datagrid,
  DatagridBody,
  RecordContextProvider,
  DatagridRowProps,
  DatagridBodyProps,
  DatagridProps,
} from "react-admin";
import {
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import {
  TableCell,
  TableRow,
  Checkbox,
} from "@mui/material";
const MyDatagridRow = ({
  record,
  id,
  onToggleItem,
  children,
  selected,
  selectable,
  hasBulkActions,
}: DatagridRowProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging, over, active } = useDraggable({
    id: id,
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 1000px)`,
    borderLeft: "1pt solid black",
  } : undefined
  const isTransfer = () => {
    if (over && active) {
      if (String(active.id) === id) {
        if (over.id === "droppable-sftp-list" && !String(active.id).startsWith("/")) return true
        else if (over.id === "droppable-fileserver-list" && String(active.id).startsWith("/")) return true
      }
    }
    return false
  }
  if (record.cdup && id) return (
    <RecordContextProvider value={record}>
      <TableRow sx={{ bgcolor: "#ffffff" }}>
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
  )
  return (
    id ? (
      <RecordContextProvider value={record}>
        <TableRow
          style={style}
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          sx={{
            '&:hover': {
              cursor: isTransfer() ? 'copy' : (isDragging ? 'grabbing' : 'grab')
            },
            bgcolor: "#ffffff",
          }}>
          {/* first column: selection checkbox */}
          {!hasBulkActions ? null :
            <TableCell padding="none"
              style={{
                width: "0%",
              }}
            >
              {selectable && (
                <Checkbox
                  checked={selected}
                  onClick={(event) => {
                    if (onToggleItem) {
                      onToggleItem(id, event);
                    }
                  }}
                  sx={{ display: "inline-flex", justifyContent: 'row', ml: 0.8 }}
                />
              )}
            </TableCell>
          }
          {/* data columns based on children */}
          {React.Children.map(children, (field: any) =>
            <TableCell
              sx={{
                overflow: "auto"
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
    ) : null
  )
}

const MyDatagridBody = (props: DatagridBodyProps) => {
  return (
    <DatagridBody sx={{ bgcolor: "#efefef" }} {...props} row={<MyDatagridRow />} />
  )
};
export const SFTPDatagrid = (props: DatagridProps) => {
  const { className } = props
  const { setNodeRef } = useDroppable({
    id: 'droppable-' + className,
  });
  return (
    <Datagrid {...props} ref={setNodeRef} body={<MyDatagridBody className={className} />} />
  )
};