
export type PropertyValueType = "enum" | "string" | "string[]" | "bigstring" | "boolean" | "tuple"

export interface PropertySchema {
    name: string;
    type: PropertyValueType;
    label: string;
    default: any;
    description: string;
    editorStyleProps?: Record<string, any>;
    group?: string;
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

export const defaultProps: Record<string, any> = {
    "name": "",
    "description": ""
}

export const defaultPropsSchema: Record<string, PropertySchema> = {
     name: {
        name: "name",
        type: "string",
        label: "Name",
        default: "",
        description: "Name",
        group: "Info",
        editorStyleProps: {width: "100%"}
    },
     description: {
        name: "description",
        type: "string",
        label: "Description",
        default: "1px",
        description: "Description",
        group: "Info",
        editorStyleProps: {width: "100%"}
    }
}