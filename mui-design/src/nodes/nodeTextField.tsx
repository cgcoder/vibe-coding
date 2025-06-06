import type { NodeInfo, RenderContext } from "./registry";
import { type PropertySchema, type EnumPropertySchema, type Node, defaultPropsSchema, defaultProps } from "./node";
import { TextField } from "@mui/material";
import useDragAndDropStore from "./useDragAndDropStore";

export const newNode: NodeInfo["newNode"] = (type: string) => {
  return {
    parentId: "",
    id: "",
    type: "textfield",
    children: [],
    properties: getProps(),
  };
};

const propertySchema: Record<string, PropertySchema> = {
  ...defaultPropsSchema,
  label: {
    name: "label",
    type: "string",
    label: "Label",
    default: "Label",
    description: "Label for the text field",
  },
  placeholder: {
    name: "placeholder",
    type: "string",
    label: "Placeholder",
    default: "Placeholder text",
    description: "Placeholder text",
  },
  size: {
    name: "size",
    type: "enum",
    label: "Size",
    default: "small",
    description: "Size of the text field",
    options: ["medium", "small"],
  } as EnumPropertySchema,
};

function getProps(): Record<string, any> {
  return {
    ...defaultProps,
    label: "Label",
    placeholder: "Placeholder",
    size: "small",
  };
}

export const textFieldNodeInfo: NodeInfo = {
  type: "textfield",
  propertySchema,
  newNode,
  render,
};

function render(node: Node, ctx: RenderContext): React.ReactNode {
  const { setSelectedNode } = useDragAndDropStore();
  const handleClick = (e: any) => {
    setSelectedNode(node.id);
    e.stopPropagation();
  };

  return (
    <div>
      <TextField
        type="text"
        placeholder={node.properties["placeholder"]}
        label={node.properties["label"]}
        style={{ width: "100%" }}
        onClick={(e) => handleClick(e)}
      />
    </div>
  );
}
