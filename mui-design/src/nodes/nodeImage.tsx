import type { NodeInfo, RenderContext } from "./registry";
import { type PropertySchema, type EnumPropertySchema, type Node, defaultPropsSchema, defaultProps } from "./node";
import useDragAndDropStore from "./useDragAndDropStore";
import { Button } from "@mui/material";
import { Image } from "@mui/icons-material";

export const newNode = () => {
  return {
    parentId: "",
    id: "",
    type: "image",
    children: [],
    properties: getProps(),
  };
};

const propertySchema: Record<string, PropertySchema> = {
    ...defaultPropsSchema,
  imageUrl: {
    name: "text",
    type: "string",
    label: "Image URL",
    default: "",
    description: "Image URL to display",
  },
  width: {
    name: "width",
    type: "string",
    label: "Width",
    default: "100px",
    description: "Width of the image",
  },
  height: {
    name: "height",
    type: "string",
    label: "Height",
    default: "100px",
    description: "Height of the image",
  },
};

function getProps(): Record<string, any> {
  return {
    ...defaultProps,
    imageUrl: null,
    width: propertySchema["width"].default,
    height: propertySchema["height"].default,
  };
}

export const imageNodeInfo: NodeInfo = {
  type: "image",
  propertySchema: propertySchema,
  newNode,
  render: render,
};

function render(node: Node, ctx: RenderContext): React.ReactNode {
  const { setSelectedNode, selectedNodeId } = useDragAndDropStore();
  const handleClick = (e: any) => {
    e.stopPropagation();
    setSelectedNode(node.id);
  };
  const selected = node.id === selectedNodeId;
  return (
    <img
      style={{
        width: node.properties["width"],
        height: node.properties["height"],
        border: selected ? "2px dotted blue" : "none",
      }}
      src={node.properties["imageUrl"]}
      onClick={handleClick}
    >
      {node.properties["text"]}
    </img>
  );
}
