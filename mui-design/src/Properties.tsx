
import { nodeRegistry } from "./nodes/registry";
import useDragAndDropStore from "./nodes/useDragAndDropStore";
import type { PropertyValueEditorProps } from "./propertyEditors/types";
import { TupleEditor } from "./propertyEditors/TupleEditor";
import { EnumEditor } from "./propertyEditors/EnumEditor";
import { StringEditor } from "./propertyEditors/StringEditor";
import type { EnumPropertySchema, TuplePropertySchema } from "./nodes/node";
import { Box, Chip, Divider, Link, TextField } from "@mui/material";
import { StringArrEditor } from "./propertyEditors/StringArrEditor";
import { BigStringEditor } from "./propertyEditors/BigStringEditor";

export interface PropertiesProps {

}


export const PropertiesPanel: React.FC<PropertiesProps> = () => {
    const { selectedNodeId, nodes, hoverNodeId, setSelectedNode } = useDragAndDropStore();
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
        const group = nodePropSchema[key].group || "General";
        if (!groupedProps[group]) groupedProps[group] = [];
        groupedProps[group].push(key);
    });

    Object.keys(groupedProps).forEach((group) => {
        groupedProps[group].sort((a, b) => a.localeCompare(b));
    });

    const groupedPropEntries = Object.keys(groupedProps);

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                <Divider textAlign="center" style={{paddingTop: "5px", fontSize: "15px"}}>Properties</Divider>
                <PropertySection label="Type">
                    <TextField value={node.type} label="Type" size="small" style={{width: "100%"}}></TextField>
                </PropertySection>
                <PropertySection label="ID">
                    <TextField value={node.id} label="ID" size="small" style={{width: "100%"}}></TextField>
                    {node.parentId && <Link color="primary" onClick={() => setSelectedNode(node.parentId)} style={{cursor: ""}} href="#">Parent</Link>}
                </PropertySection>
                <div style={{ borderTop: "1px solid #ffffff", margin: "12px 0" }} />
                {groupedPropEntries.flatMap(g => {
                    const props = groupedProps[g].map(k => {
                        return <PropertySection label={nodePropSchema[k].label}>
                        <PropertyValueEditor nodeId={node.id} property={k} />
                    </PropertySection>});
                    return [(<Divider textAlign="center" style={{paddingTop: "5px", fontSize: "15px"}}>{g}</Divider>), ...props];
                })}
            </div>
        </>
    );
}

type PropertySectionProps = {
    children: React.ReactNode;
    label: string;
}

const PropertySection: React.FC<PropertySectionProps> = ({children, label}) => {
    return <div style={{ display: "flex", flexDirection: "row", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
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
        {(nodePropSchema.type === "bigstring") && <BigStringEditor nodeId={nodeId} property={property} />}
        {(nodePropSchema.type === "string[]") && <StringArrEditor nodeId={nodeId} property={property} />}
        {(nodePropSchema.type === "tuple") && <TupleEditor nodeId={nodeId} property={property} tupleCount={(nodePropSchema as TuplePropertySchema).tupleCount} />}
        {(nodePropSchema.type === "enum") && <EnumEditor nodeId={nodeId} property={property} />}
    </>
}
