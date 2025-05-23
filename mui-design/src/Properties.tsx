
import { nodeRegistry } from "./nodes/registry";
import useDragAndDropStore from "./nodes/useDragAndDropStore";
import type { PropertyValueEditorProps } from "./propertyEditors/types";
import { TupleEditor } from "./propertyEditors/TupleEditor";
import { EnumEditor } from "./propertyEditors/EnumEditor";
import { StringEditor } from "./propertyEditors/StringEditor";
import type { TuplePropertySchema } from "./nodes/node";
import { Box, Divider, Link, Typography } from "@mui/material";
import { StringArrEditor } from "./propertyEditors/StringArrEditor";
import { BigStringEditor } from "./propertyEditors/BigStringEditor";
import React from "react";
import ChildPanel from "./ChildPanel";

export interface PropertiesProps {

}

const groupOrder: Record<string, number> = {
    "Info": 0,
    "General": 1,
    "Padding": 2,
    "Gap": 3,
    "Size": 4,
    "Flex": 5,
    "Overrides": 100
}

function order(k: string) {
    return groupOrder[k] ?? "99";
}

export const PropertiesPanel: React.FC<PropertiesProps> = () => {
    const { selectedNodeId, nodes, hoverNodeId, toggleSection, collapsedSections } = useDragAndDropStore();
    const nodeId = selectedNodeId || hoverNodeId;
    const node = nodeId ? nodes[nodeId] : null;

    if (!node || node.type === 'root') {
        return <div>Select a node to see its properties</div>;
    }

    const nodeProps = node.properties ?? {};
    const nodePropSchema = nodeRegistry.nodeInfoMap[node.type].propertySchema;

    const propKeys = Object.keys(nodeProps);
    // Group properties by 'group' property in schema, then sort within each group
    const groupedProps: Record<string, string[]> = {};

    propKeys.forEach((key) => {
        const group = nodePropSchema[key].section || "General";
        if (!groupedProps[group]) groupedProps[group] = [];
        groupedProps[group].push(key);
    });

    Object.keys(groupedProps).forEach((group) => {
        groupedProps[group].sort((a, b) => a.localeCompare(b));
    });

    const groupedPropEntries = Object.keys(groupedProps).sort((a, b) => order(a) - order(b))

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, padding: '10px' }}>
                <Divider textAlign="center" style={{paddingTop: "1px", fontSize: "12px"}}>Properties</Divider>
                <Box flex="row"><Typography variant="subtitle1">Type: {node.type}, ID: {node.id}</Typography></Box>
                {groupedPropEntries.flatMap(g => {
                    const props = collapsedSections.indexOf(g) >= 0 ? [] : groupedProps[g].map(k => {
                        return <PropertySection key={k} label={nodePropSchema[k].label}>
                        <PropertyValueEditor nodeId={node.id} property={k} />
                    </PropertySection>});
                    return [(<Divider key={`divider-${g}`} textAlign="center" style={{paddingTop: "1px", fontSize: "12px"}}><b><Link href="#" onClick={() => toggleSection(g)}>{g}</Link></b></Divider>), ...props];
                })}
                <Divider key={`divider-tree`} textAlign="center" style={{paddingTop: "1px", fontSize: "12px"}}><b><Link href="#" onClick={() => toggleSection("tree")}>Node Tree</Link></b></Divider>
                <ChildPanel id="Node 0" pl={0} />
            </div>
        </>
    );
}

type PropertySectionProps = {
    children: React.ReactNode;
    label: string;
}

const PropertySection: React.FC<PropertySectionProps> = ({children, label}) => {
    return <div style={{ display: "flex", flexDirection: "row", gap: 5, alignItems: "center", flexWrap: "wrap" }}>
        {children}
    </div>
}

export const PropertyValueEditor: React.FC<PropertyValueEditorProps> = ({nodeId, property}) => {
    const { nodes, hoverNodeId, setNodeProperty } = useDragAndDropStore();
    const node = nodes[nodeId];
    const nodePropSchema = nodeRegistry.nodeInfoMap[node.type].propertySchema[property];

    if (!nodePropSchema) return null;

    return <>
        {(nodePropSchema.type === "string") && <StringEditor nodeId={nodeId} property={property} />}
        {(nodePropSchema.type === "bigstring") && <BigStringEditor key={nodeId} nodeId={nodeId} property={property} />}
        {(nodePropSchema.type === "string[]") && <StringArrEditor nodeId={nodeId} property={property} />}
        {(nodePropSchema.type === "tuple") && <TupleEditor nodeId={nodeId} property={property} tupleCount={(nodePropSchema as TuplePropertySchema).tupleCount} />}
        {(nodePropSchema.type === "enum") && <EnumEditor nodeId={nodeId} property={property} />}
    </>
}
