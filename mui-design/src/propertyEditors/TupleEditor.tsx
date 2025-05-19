
import useDragAndDropStore from "../nodes/useDragAndDropStore";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import type { PropertyValueEditorProps } from "./types";
import { nodeRegistry } from "../nodes/registry";
import type { TuplePropertySchema } from "../nodes/node";

export interface TupleEditorProps extends PropertyValueEditorProps {
    tupleCount: number;
}

export const TupleEditor: React.FC<TupleEditorProps> = ({nodeId, property}) => {
    const { nodes, setNodeProperty } = useDragAndDropStore();
    const node = nodes[nodeId];

    const value = (node.properties?.[property] ?? "").split(" ").slice(0, 4);

    const propSchema = nodeRegistry.nodeInfoMap[node.type].propertySchema[property] as TuplePropertySchema;

    const handleChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValues = [...value];
        newValues[idx] = e.target.value;
        setNodeProperty(nodeId, property, newValues.join(" "));
    };

    return (
        <Box display="flex" gap={2} flexWrap={"wrap"} height="100%">
            {Array.from({ length: propSchema.tupleCount }, (_, i) => (
                <TextField
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