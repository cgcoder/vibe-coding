
import useDragAndDropStore from "../nodes/useDragAndDropStore";
import Box from "@mui/material/Box";
import type { PropertyValueEditorProps } from "./types";
import { nodeRegistry } from "../nodes/registry";
import type { TuplePropertySchema } from "../nodes/node";
import { DebouncedTextField } from "./DebounceTextField";

export interface TupleEditorProps extends PropertyValueEditorProps {
    tupleCount: number;
}

export const TupleEditor: React.FC<TupleEditorProps> = ({nodeId, property}) => {
    const { nodes, setNodeProperty } = useDragAndDropStore();
    const node = nodes[nodeId];

    const value = node.properties?.[property];

    const propSchema = nodeRegistry.nodeInfoMap[node.type].propertySchema[property] as TuplePropertySchema;

    const handleChange = (idx: number) => (e: string) => {
        const newValues = [...value];
        newValues[idx] = e;
        setNodeProperty(nodeId, property, newValues);
    };

    return (
        <Box display="flex" gap={2} flexWrap={"wrap"} height="100%">
            {Array.from({ length: propSchema.tupleCount }, (_, i) => (
                <DebouncedTextField
                    key={i}
                    value={value[i] ?? ""}
                    onChange={handleChange(i)}
                    size="small"
                    variant="outlined"
                    label={propSchema.tupleLabel[i]}
                    style={{...propSchema.editorStyleProps}}
                />
            ))}
        </Box>
    );
};