import useDragAndDropStore from "./useDragAndDropStore"
import { NodeComponent } from "./NodeComponent";

export const RootNode = () => {
    const { rootNode, nodes } = useDragAndDropStore();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '8px' }} data-metadata-type="rootparent">
            <NodeComponent key={rootNode.id} nodeId={rootNode.id}></NodeComponent>
        </div>
    )
};
