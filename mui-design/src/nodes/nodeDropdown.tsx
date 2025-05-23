
import type { NodeInfo, RenderContext } from "./registry";
import { type PropertySchema, type EnumPropertySchema, type Node, defaultPropsSchema, defaultProps } from "./node";
import useDragAndDropStore from "./useDragAndDropStore";
import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

export const newNode = () => {
    return {
        parentId: '',
        id: '',
        type: 'dropdown',
        children: [],
        properties: getProps()
    };
}

const propertySchema: Record<string, PropertySchema> = {
            ...defaultPropsSchema,
            "options": {
                name: "options",
                type: "bigstring",
                label: "Options",
                default: "Option 1",
                description: "Options to show in the dropdown"
            },
            "label": {
                name: "label",
                type: "string",
                label: "Label",
                default: "Label",
                description: "The color of the button"
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
                description: "Variant of dropdown",
                options: ["default", "standard", "filled"]
            } as EnumPropertySchema
        }

function getProps(): Record<string, any> {
    return {
            ...defaultProps,
            "options": "Option 1",
            "label": "Label",
            "size": "medium",
            "variant": "outlined"
        };
}

export const dropdownNodeInfo: NodeInfo = {
    type: 'dropdown',
    propertySchema: propertySchema,
    newNode,
    render: render
}

function render(node: Node, ctx: RenderContext): React.ReactNode {
    const { setSelectedNode } = useDragAndDropStore();

    const options: string[] = node.properties["options"].split("\n").map((s: string) => s.trim());
    const [value, setValue] = React.useState("")
    const handleChange = (e: any) => {
        e.stopPropagation();
        setSelectedNode(node.id);
        setValue(e.target.value);
    };
    const handleClick = (e: any) => {
        setSelectedNode(node.id);
        e.stopPropagation();
    }
    
    return <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{node.properties["label"]}</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={value}
            label={node.properties["label"]}
            onChange={handleChange}
            onClick={handleClick}
            size={node.properties["size"]}
            variant={node.properties["variant"] === "default" ? undefined : node.properties["variant"]}
        >
            {options.map((o, i) => <MenuItem key={`${o}-${i}`} value={o}>{o}</MenuItem>)}
        </Select>
        </FormControl>
}