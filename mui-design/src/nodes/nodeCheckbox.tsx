import type { NodeInfo, RenderContext } from "./registry";
import { type PropertySchema, type EnumPropertySchema, type Node, defaultProps, defaultPropsSchema } from "./node";
import useDragAndDropStore from "./useDragAndDropStore";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

export const newNode = () => {
  return {
    parentId: "",
    id: "",
    type: "checkbox",
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
    description: "Label for the Checkbox",
  },
  color: {
    name: "color",
    type: "enum",
    label: "Color",
    default: "primary",
    description: "The color of the button",
    options: ["primary", "secondary", "success", "default"],
  } as EnumPropertySchema,
  size: {
    name: "size",
    type: "enum",
    label: "Size",
    default: "small",
    description: "The size of the button",
    options: ["small", "medium", "large"],
  } as EnumPropertySchema,
};

function getProps(): Record<string, any> {
  return {
    ...defaultProps,
    label: "Label",
    color: "default",
    size: "small",
  };
}

export const checkboxNodeInfo: NodeInfo = {
  type: "checkbox",
  propertySchema: propertySchema,
  newNode,
  render: render,
};

function render(node: Node, ctx: RenderContext): React.ReactNode {
  const { setSelectedNode } = useDragAndDropStore();
  const handleClick = (e: any) => {
    e.stopPropagation();
    setSelectedNode(node.id);
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
            defaultChecked
            color={node.properties["color"]}
            size={node.properties["size"]}
            onClick={handleClick}
          />
        }
        label={node.properties["label"]}
      />
    </FormGroup>
  );
}
