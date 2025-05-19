import type { NodeInfo, RenderContext } from "./registry";
import type { PropertySchema, EnumPropertySchema, Node } from "./node";
import { TextField, Typography } from "@mui/material";
import useDragAndDropStore from "./useDragAndDropStore";

export const newNode: NodeInfo["newNode"] = (type: string) => {
  return {
    parentId: "",
    id: "",
    type: "typography",
    children: [],
    properties: getProps(),
  };
};

const propertySchema: Record<string, PropertySchema> = {
    text: {
        name: "text",
        type: "string",
        label: "Text",
        default: "Text",
        description: "Typography Text",
    },
    variant: {
        name: "variant",
        type: "enum",
        label: "Variant",
        default: "h3",
        description: "Typography variant",
        options: [
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "subtitle1",
            "subtitle2",
            "body1",
            "body2",
            "caption",
            "button",
            "overline",
            "inherit",
        ],
    } as EnumPropertySchema,
};

function getProps(): Record<string, any> {
  return {
    text: "Text",
    variant: "h3"
  };
}

export const typographyNodeInfo: NodeInfo = {
  type: "typography",
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
