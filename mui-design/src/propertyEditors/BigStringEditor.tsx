import { TextField } from "@mui/material";
import { nodeRegistry } from "../nodes/registry";
import useDragAndDropStore from "../nodes/useDragAndDropStore";
import type { PropertyValueEditorProps } from "./types";
import React from "react";

export const BigStringEditor: React.FC<PropertyValueEditorProps> = ({
  nodeId,
  property,
}) => {
  const { nodes, setNodeProperty } = useDragAndDropStore();
    const node = nodes[nodeId];
  const [value, setValue] = React.useState(node.properties[property]);
  const [handle, setHandle] = React.useState<number | null>(null);
  const schema = nodeRegistry.nodeInfoMap[node.type].propertySchema[property];
  

  function handleInputChange(e: any): void {
    setValue(e.target.value);
    if (handle) clearTimeout(handle);
    setHandle(setTimeout(() => setNodeProperty(nodeId, property, e.target.value), 200));
  }

  return (
    <TextField
      multiline={true}
      rows={10}
      type="text"
      label={schema.label}
      value={value ?? ""}
      placeholder={node.properties["placeholder"]}
      size="small"
      onChange={handleInputChange}
      style={{width: "100%", ...schema.editorStyleProps}}
    />
  );
};
