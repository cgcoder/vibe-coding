import { nodeRegistry } from "../nodes/registry";
import useDragAndDropStore from "../nodes/useDragAndDropStore";
import type { PropertyValueEditorProps } from "./types";
import { DebouncedTextField } from "./DebounceTextField";

export const StringArrEditor: React.FC<PropertyValueEditorProps> = ({
  nodeId,
  property,
}) => {
  const { nodes, setNodeProperty } = useDragAndDropStore();
  const node = nodes[nodeId];
  const values: string[] = node.properties?.[property] ?? [];
  const schema = nodeRegistry.nodeInfoMap[node.type].propertySchema[property];

  const handleChange = (e: string, index: number) => {
    node.properties[property][index] = e;
    setNodeProperty(nodeId, property, node.properties?.[property]);
  };

  return values.map((v, i) => (
    <DebouncedTextField
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
