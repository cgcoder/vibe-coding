import type { NodeInfo, RenderContext } from "./registry";
import type { PropertySchema, EnumPropertySchema, Node } from "./node";
import { Box, Typography } from "@mui/material";
import useDragAndDropStore from "./useDragAndDropStore";
import { DataGrid, type GridCellParams, type GridColDef, type MuiEvent } from '@mui/x-data-grid';

export const newNode: NodeInfo["newNode"] = (type: string) => {
  return {
    parentId: "",
    id: "",
    type: "table",
    children: [],
    properties: getProps(),
  };
};

const propertySchema: Record<string, PropertySchema> = {
    header: {
        name: "header",
        type: "bigstring",
        label: "Header",
        default: "",
        description: "Header",
    },
    rows: {
        name: "rows",
        type: "bigstring",
        label: "Rows",
        default: "",
        description: "Rows"
    },
    width: {
        name: "width",
        type: "string",
        label: "Width",
        default: "",
        description: "Width"
    },
};

function getProps(): Record<string, any> {
  return {
    header: `header1,60
    header2,60`,
    rows: `row11,60
    row12,60`,
    width: '100%'
  };
}

export const tableNodeInfo: NodeInfo = {
  type: "table",
  propertySchema,
  newNode,
  render,
};

function parseHeader(data: string) {
    let header: Record<string, any>[] = [];
    const rows = data.split("\n").map(m => m.trim());

    header = rows.map((r, i) => {
        const cols = r.split(",").map(c => c.trim());

        return {field: `${i}`, headerName: cols[0], width: cols[1] ?? 100};
    });
    return header;
}

function parseRows(headers: any[], data: string) {
    const rows = data.split("\n").map(m => m.trim());
    return rows.map((r, idx) => {
        const cols = r.split(",").map(m => m.trim());
        const rowData: any = {id: idx};
        for (let i = 0; i < headers.length; i++) {
            rowData[headers[i].field] = cols[i];
        }
        return rowData;
    });
}

function render(node: Node, ctx: RenderContext): React.ReactNode {
  const { setSelectedNode } = useDragAndDropStore();
  const handleClick = (e: any) => {
    e.stopPropagation();
    setSelectedNode(node.id);
  };

  const columns = parseHeader(node.properties["header"]);
  const rows = parseRows(columns, node.properties["rows"]);
  //console.log('columns', columns);
  //console.log('rows', rows);
  return (
        <Box onClick={handleClick} style={{width: node.properties["width"]}}>
            <DataGrid
                rows={rows as any}
                columns={columns as any}
                initialState={{
                pagination: {
                    paginationModel: {
                    pageSize: 5,
                    },
                },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
            />
      </Box>
  );
}
