import { arrToObj } from "./utils";

export type PropertyValueType = "enum" | "string" | "string[]" | "bigstring" | "boolean" | "tuple"

export interface PropertySchema {
    name: string;
    type: PropertyValueType;
    label: string;
    default: any;
    description: string;
    editorStyleProps?: Record<string, any>;
    section?: string;
}

export interface Node {
    id: string; // Unique identifier
    type: string; // Type of the node (e.g., 'button', 'input', etc.)
    parentId?: string; // Parent node ID for nested structures
    children?: string[]; // Array of child node IDs
    properties: Record<string, any>; // Additional properties (e.g., label, color)
}


export interface EnumPropertySchema extends PropertySchema {
    type: 'enum',
    options: string[]
}

export interface TuplePropertySchema extends PropertySchema {
    type: 'tuple',
    tupleCount: number,
    tupleLabel: string[]
}

let _nextId = 1;

export function nextId(): string {
    _nextId++;
    return `node ${_nextId}`;
}

export function nextIdAsNumber(): number {
    return ++_nextId;

}

export function setNextId(id: number) {
    _nextId = id;
    _nextId++;
}

export const defaultProps: Record<string, any> = {
    "name": "",
    "description": "",
    "styleOverrides": "",
    "size": ["100%", "", "", "10px", "", ""],
    padding: ["5px", "5px", "5px", "5px"],
}

export function nodeSize(node: Node): any {
    return arrToObj(node.properties["size"], "width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight");
}

export function nodePadding(node: Node): any {
    return arrToObj(node.properties["padding"], "paddingLeft", "paddingRight", "paddingTop", "paddingBottom");
}

export const defaultPropsSchema: Record<string, PropertySchema> = {
     name: {
        name: "name",
        type: "string",
        label: "Name",
        default: "",
        description: "Name",
        section: "Info",
        editorStyleProps: {width: "100%"}
    },
     description: {
        name: "description",
        type: "string",
        label: "Description",
        default: "1px",
        description: "Description",
        section: "Info",
        editorStyleProps: {width: "100%"}
    },
    styleOverrides: {
        name: "styleOverrides",
        type: "bigstring",
        label: "Style Overrides",
        default: "",
        description: "Style Overrides",
        section: "Overrides",
        editorStyleProps: {width: "100%"}
    },
    size: {
        name: "size",
        type: "tuple",
        label: "Sap",
        default: "1px",
        description: "Size",
        tupleCount: 6,
        tupleLabel: ["Width", "Height", "Min Width", "Min Height", "Max Width", "Max Height"],
        editorStyleProps: {
            "maxWidth": "120px"
        },
        section: "Size"
    } as TuplePropertySchema,
    padding: {
        name: "padding",
        type: "tuple",
        label: "Padding",
        default: "5px 5px 5px 5px",
        description: "Padding",
        tupleCount: 4,
        tupleLabel: ["Left", "Right", "Top", "Bottom"],
        editorStyleProps: {
            "maxWidth": "120px"
        },
        section: "Padding"
    } as TuplePropertySchema,
}