
import type { NodeInfo, RenderContext } from "./registry";
import type { PropertySchema, Node } from "./node";
import useDragAndDropStore from "./useDragAndDropStore";
import { Divider } from "@mui/material";

export const newNode = () => {
    return {
        parentId: '',
        id: '',
        type: 'divider',
        children: [],
        properties: getProps()
    };
}

const propertySchema: Record<string, PropertySchema> = {}

function getProps(): Record<string, any> {
    return {
        };
}

export const dividerNodeInfo: NodeInfo = {
    type: 'divider',
    propertySchema: propertySchema,
    newNode,
    render: render
}

function render(node: Node, ctx: RenderContext): React.ReactNode {
    const { setSelectedNode } = useDragAndDropStore();
    const handleClick = () => {
        setSelectedNode(node.id);
    };
    
    return <Divider onClick={handleClick} style={{width: "100%"}} />
}