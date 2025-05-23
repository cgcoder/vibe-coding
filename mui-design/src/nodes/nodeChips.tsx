
import type { NodeInfo, RenderContext } from "./registry";
import { type PropertySchema, type EnumPropertySchema, type Node, defaultProps, defaultPropsSchema } from "./node";
import useDragAndDropStore from "./useDragAndDropStore";
import { Button, Chip } from "@mui/material";

export const newNode = () => {
    return {
        parentId: '',
        id: '',
        type: 'chips',
        children: [],
        properties: getProps()
    };
}

const propertySchema: Record<string, PropertySchema> = {
            ...defaultPropsSchema,
            "values": {
                name: "values",
                type: "bigstring",
                label: "Chip Values",
                default: "",
                description: "Chips to be displayed. Separated by new line."
            },
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
                description: "Style of the chip",
                options: ["default", "outlined"]
            } as EnumPropertySchema
        }

function getProps(): Record<string, any> {
    return {
            ...defaultProps,
            "values": "value1",
            "size": "small",
            "variant": "outlined"
        };
}

export const chipsNodeInfo: NodeInfo = {
    type: 'chips',
    propertySchema: propertySchema,
    newNode,
    render: render
}

function render(node: Node, ctx: RenderContext): React.ReactNode {
    const values = (node.properties["values"] as string).split("\n").map(m => m.trim());
    return <>
        {values.map(v => <Chip variant={node.properties["variant"]} label={v} size={node.properties["size"]} />)}
    </>
}