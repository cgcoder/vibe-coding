
import type { NodeInfo, RenderContext } from "./registry";
import { type PropertySchema, type Node, defaultProps, defaultPropsSchema } from "./node";
import useDragAndDropStore from "./useDragAndDropStore";
import { Divider } from "@mui/material";
import { nodeStyle } from "./utils";

export const newNode = () => {
    return {
        parentId: '',
        id: '',
        type: 'divider',
        children: [],
        properties: getProps()
    };
}

const propertySchema: Record<string, PropertySchema> = {
    ...defaultPropsSchema
}

function getProps(): Record<string, any> {
    return {
        ...defaultProps,
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
    let styleOverrides = nodeStyle(node);
    return <Divider onClick={handleClick} style={{width: "100%", ...styleOverrides}} />
}