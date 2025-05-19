import { TextField } from "@mui/material";
import { nodeRegistry } from "../nodes/registry";
import useDragAndDropStore from "../nodes/useDragAndDropStore";
import type { PropertyValueEditorProps } from "./types";

export const StringEditor: React.FC<PropertyValueEditorProps> = ({
  nodeId,
  property,
}) => {
  const { nodes, setNodeProperty } = useDragAndDropStore();
  const node = nodes[nodeId];

  const schema = nodeRegistry.nodeInfoMap[node.type].propertySchema[property];

  return (
    <TextField
      type="text"
      label={schema.label}
      value={node.properties?.[property] ?? ""}
      placeholder={node.properties["placeholder"]}
      size="small"
      onChange={(e) => setNodeProperty(nodeId, property, e.target.value)}
      style={{...schema.editorStyleProps}}
    />
  );
};
