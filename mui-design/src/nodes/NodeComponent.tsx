import React from "react";
import useDragAndDropStore from "./useDragAndDropStore";
import { nodeRegistry, type RenderContext } from "./registry";
import type { Node } from "./node";

export interface NodeComponentProps {
    nodeId: string;
    children?: React.ReactNode; // Add this line to allow children
}

export const NodeComponent: React.FC<NodeComponentProps> = ({ nodeId }: NodeComponentProps) => {
    const { nodes } = useDragAndDropStore();
    const node = nodes[nodeId];
    const [hover, setHover] = React.useState(false);

    return renderComponent(node, hover);
}

function renderComponent(node: Node, hover: boolean): React.ReactNode {
    const nodeInfo = nodeRegistry.nodeInfoMap[node.type];
    const ctx: RenderContext = {hover};
    return nodeInfo.render(node, ctx);
}
