import type { NodeInfo, RenderContext } from "./registry";
import type { PropertySchema, EnumPropertySchema, Node } from "./node";
import { Typography } from "@mui/material";
import useDragAndDropStore from "./useDragAndDropStore";
import { DataGrid } from '@mui/x-data-grid';

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
};

function getProps(): Record<string, any> {
  return {
    header: "",
    rows: ""
  };
}

export const tableNodeInfo: NodeInfo = {
  type: "table",
  propertySchema,
  newNode,
  render,
};

function render(node: Node, ctx: RenderContext): React.ReactNode {
  const { setSelectedNode } = useDragAndDropStore();
  const handleClick = (e: any) => {
    e.stopPropagation();
    setSelectedNode(node.id);
  };

  return (
      <Typography
        variant={node.properties["variant"]} onClick={handleClick}>{node.properties["text"]}</Typography>
  );
}
