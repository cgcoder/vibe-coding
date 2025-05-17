import useDragAndDropStore from "./useDragAndDropStore"
import AddNodeButton from "./AddNodeButton";
import { NodeComponent } from "./NodeComponent";

export const RootNode = () => {
    const { rootNode, nodes, setHoverNode } = useDragAndDropStore();
    const childNode = rootNode.children!.map(child => nodes[child]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
            {childNode.map((node) => {
               return <NodeComponent key={node.id} nodeId={node.id}></NodeComponent> 
            })}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '5px', border: '2px dashed #ccc', width: '80%' }}
                onMouseEnter={() => setHoverNode(rootNode.id)}>
                <AddNodeButton nodeId={rootNode.id} />
            </div>
        </div>
    )
};
