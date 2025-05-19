import { TextField } from "@mui/material";
import { nodeRegistry } from "../nodes/registry";
import useDragAndDropStore from "../nodes/useDragAndDropStore";
import type { PropertyValueEditorProps } from "./types";

export const StringArrEditor: React.FC<PropertyValueEditorProps> = ({
  nodeId,
  property,
}) => {
  const { nodes, setNodeProperty } = useDragAndDropStore();
  const node = nodes[nodeId];
  const values: string[] = node.properties?.[property] ?? [];
  const schema = nodeRegistry.nodeInfoMap[node.type].propertySchema[property];

  const handleChange = (e: any, index: number) => {
    node.properties[property][index] = e.target.value;
    setNodeProperty(nodeId, property, node.properties?.[property]);
  };

  return values.map((v, i) => (
    <TextField
      key={i}
      type="text"
      value={v}
      placeholder={node.properties["placeholder"]}
      size="small"
      onChange={(e) => handleChange(e, i)}
      {...schema.editorStyleProps}
    />
  ));
};
