import type React from "react";
import type { Node, PropertySchema } from "./node";
import type { UIState } from "./useDragAndDropStore";

export interface NodeRegistry {
  nodeInfoMap: Record<string, NodeInfo>;
  registerNode: (info: NodeInfo) => void;
  createNode: (type: string) => Node;
}

export interface RenderContext {
    hover: boolean;
}

export interface NodeInfo {
  type: string;
  propertySchema: Record<string, PropertySchema>;
  newNode: (type: string) => Node;
  render: (node: Node, ctx: RenderContext) => React.ReactNode;
  onChildUpdate?: (id: string, state: UIState) => Partial<UIState>;
}

export const nodeRegistry: NodeRegistry = {
  nodeInfoMap: {},
  registerNode: (info: NodeInfo) => {
    nodeRegistry.nodeInfoMap[info.type] = info;
  },
  createNode: (type: string) => {
    const nodeInfo = nodeRegistry.nodeInfoMap[type];
    return nodeInfo.newNode(type);
  },
};

export function validateRegistry() {
  for (const [type, info] of Object.entries(nodeRegistry.nodeInfoMap)) {
    const node = info.newNode(type);
    const nodeProps = node.properties ?? {};
    const schemaProps = info.propertySchema;

    for (const key of Object.keys(schemaProps)) {
      if (!(key in nodeProps)) {
        console.error(`Node of type "${type}" is missing property "${key}" defined in its propertySchema.`);
      }
    }
    for (const key of Object.keys(nodeProps)) {
      if (!(key in schemaProps)) {
        console.error(`Node of type "${type}" has extra property "${key}" not defined in its propertySchema.`);
      }
    }
  }
}