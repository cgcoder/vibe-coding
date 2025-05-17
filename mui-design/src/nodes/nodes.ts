import type { Node } from "./useDragAndDropStore";

export const newButtonNode: (parentId: string) => Node = (parentId: string) => {
    return {
        parentId,
        id: '',
        type: 'button',
        children: [],
        ...getButtonProps()
    };
}

export interface PropertySchema {
    type: string;
    label: string;
    default: any;
    description: string;
}

export interface EnumPropertySchema extends PropertySchema {
    options: string[];
}

function getButtonProps(): {properties: Record<string, any>, propertySchema: Record<string, PropertySchema>} {
    return {
        properties: {
            "text": "Button",
            "color": "primary",
            "size": "small"
        },
        propertySchema: {
            "text": {
                type: "string",
                label: "Button Text",
                default: "Button",
                description: "The text displayed on the button"
            },
            "color": {
                type: "string",
                label: "Color",
                default: "primary",
                description: "The color of the button",
                options: ['inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'],
            } as EnumPropertySchema,
            "size": {
                type: "string",
                label: "Size",
                default: "small",
                description: "The size of the button"
            }
        }
    }
}

export const newSpanNode: (parentId: string) => Node = (parentId: string) => {
    return {
        parentId,
        id: '',
        type: 'span',
        children: [],
        properties: {},
        propertySchema: {}
    };
}

export const newFlexRowNode: (parentId: string) => Node = (parentId: string) => {
    return {
        parentId,
        id: '',
        type: 'flex-row',
        children: [],
        properties: {},
        propertySchema: {}
    };
}

export const newFlexColumnNode: (parentId: string) => Node = (parentId: string) => {
    return {
        parentId,
        id: '',
        type: 'flex-column',
        children: [],
        properties: {},
        propertySchema: {}
    };
}

export const newTextNode: (parentId: string) => Node = (parentId: string) => {
    return {
        parentId,
        id: '',
        type: 'textbox',
        children: [],
        properties: {},
        propertySchema: {}
    };
}

export const newTabNode: (parentId: string) => Node = (parentId: string) => {
    return {
        parentId,
        id: '',
        type: 'tab',
        children: [],
        properties: {},
        propertySchema: {}
    };
}