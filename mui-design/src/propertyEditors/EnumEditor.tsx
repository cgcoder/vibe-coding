import { MenuItem, FormControl, Select, InputLabel } from "@mui/material";
import type { EnumPropertySchema } from "../nodes/node";
import { nodeRegistry } from "../nodes/registry";
import useDragAndDropStore from "../nodes/useDragAndDropStore";
import type { PropertyValueEditorProps } from "./types";

export const EnumEditor: React.FC<PropertyValueEditorProps> = ({
  nodeId,
  property,
}) => {
  const { nodes, setNodeProperty } = useDragAndDropStore();
  const node = nodes[nodeId];

  const value = (node.properties?.[property] ?? "").split(" ").slice(0, 4);
  const nodePropSchema = nodeRegistry.nodeInfoMap[node.type].propertySchema[
    property
  ] as EnumPropertySchema;

  if (!nodePropSchema) return null;

  const selectChange = (v: any) => {
    setNodeProperty(nodeId, property, v.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id={`label-${property}`}>{nodePropSchema.label}</InputLabel>
      <Select
        labelId={`label-${property}`}
        id={`select-enum-${property}`}
        value={value ?? ""}
        label={nodePropSchema.label}
        onChange={selectChange}
        size="small"
      >
        {nodePropSchema.options.map((opt: string) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
