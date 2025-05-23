import type { NodeInfo, RenderContext } from "./registry";
import { type PropertySchema, type EnumPropertySchema, type Node, defaultPropsSchema, defaultProps } from "./node";
import useDragAndDropStore from "./useDragAndDropStore";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

export const newNode = () => {
  return {
    parentId: "",
    id: "",
    type: "radiogroup",
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
    default: "",
    description: "Label",
  },
  options: {
    name: "options",
    type: "bigstring",
    label: "Options",
    default: "",
    description: "Enter valid options",
  },
  direction: {
    name: "direction",
    type: "enum",
    label: "Direction",
    default: "",
    description: "Direction for options",
    options: ["horizontal", "vertical"],
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
    options: "",
    direction: "horizontal",
    size: "small",
  };
}

export const radiogroupNodeInfo: NodeInfo = {
  type: "radiogroup",
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

  const options: string[] = node.properties["options"].split("\n")

  return (
    <FormControl>
      {node.properties["label"] && <FormLabel id={`radiogroup-label-${node.id}`}>{node.properties["label"]}</FormLabel>}
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue={options.length ? options[0] : undefined}
        name="radio-buttons-group"
        row={node.properties["direction"] === "horizontal"}
      >
        {options.map(o => <FormControlLabel key={o} control={<Radio onClick={handleClick}  />} label={o} />)}
      </RadioGroup>
    </FormControl>
  );
}
