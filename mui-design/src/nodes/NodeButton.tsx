
import type { NodeInfo, RenderContext } from "./registry";
import type { PropertySchema, EnumPropertySchema, Node } from "./node";
import useDragAndDropStore from "./useDragAndDropStore";
import { Button } from "@mui/material";

export const newNode = () => {
    return {
        parentId: '',
        id: '',
        type: 'button',
        children: [],
        properties: getProps()
    };
}

const propertySchema: Record<string, PropertySchema> = {
            "text": {
                name: "text",
                type: "string",
                label: "Button Text",
                default: "Button",
                description: "The text displayed on the button"
            },
            "color": {
                name: "color",
                type: "enum",
                label: "Color",
                default: "primary",
                description: "The color of the button",
                options: ['inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'],
            } as EnumPropertySchema,
            "size": {
                name: "size",
                type: "enum",
                label: "Size",
                default: "small",
                description: "The size of the button",
                options: ["small", "medium", "large"]
            } as EnumPropertySchema,
            "variant": {
                name: "variant",
                type: "enum",
                label: "Variant",
                default: "text",
                description: "The size of the button",
                options: ["text", "contained", "outlined"]
            } as EnumPropertySchema
        }

function getProps(): Record<string, any> {
    return {
            "text": "Button",
            "color": "primary",
            "size": "small",
            "variant": "outlined"
        };
}

export const buttonNodeInfo: NodeInfo = {
    type: 'button',
    propertySchema: propertySchema,
    newNode,
    render: render
}

function render(node: Node, ctx: RenderContext): React.ReactNode {
    const { setSelectedNode } = useDragAndDropStore();
    const handleClick = (e: any) => {
        e.stopPropagation();
        setSelectedNode(node.id);
    };
    
    return <Button {...node.properties} style={{  }} onClick={handleClick}>{node.properties["text"]}</Button>
}