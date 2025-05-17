import useDragAndDropStore from "./nodes/useDragAndDropStore";

export interface PropertiesProps {

}

export const PropertiesPanel: React.FC<PropertiesProps> = () => {
    const { selectedNodeId, nodes, hoverNodeId } = useDragAndDropStore();
    const nodeId = selectedNodeId || hoverNodeId;
    const node = nodeId ? nodes[nodeId] : null;

    if (!node) {
        return <div>Select a node to see its properties</div>;
    }

    return (
        <div>
            <h3>Properties</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                    <tr>
                        <td style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Type:</td>
                        <td style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>{node.type}</td>
                    </tr>
                    <tr>
                        <td style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>ID:</td>
                        <td style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>{node.id}</td>
                    </tr>
                    <tr>
                        <td style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>Parent ID:</td>
                        <td style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>{node.parentId}</td>
                    </tr>
                    {/* Add more properties as needed */}
                </tbody>
            </table>
        </div>
    );
}