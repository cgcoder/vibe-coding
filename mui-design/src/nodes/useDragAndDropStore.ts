import { create } from 'zustand';
import type { PropertySchema, Node } from './node';
import { nodeRegistry } from './registry';
import { newNode } from './nodeFlex';

export interface UIState {
    rootNode: Node;
    nodes: Record<string, Node>; // All nodes in the UI
    selectedNodeId?: string; // Currently selected node
    draggedNodeId?: string; // Currently dragged node
    hoverNodeId?: string;
    addNode: (node: Node) => void; // Add a new node
    updateNode: (id: string, updates: Partial<Node>) => void; // Update a node
    removeNode: (id: string) => void; // Remove a node
    setDraggedNode: (id?: string) => void; // Set the currently dragged node
    setHoverNode: (id?: string) => void;
    setSelectedNode: (id?: string) => void; // Set the currently selected node
    setNodeProperty: (id: string, property: string, value: any) => void;
}

let ID_COUNTER = 0;

function nextId() {
    return `Node ${++ID_COUNTER}`;
}
type Setter = (partial: UIState | Partial<UIState> | ((state: UIState) => UIState | Partial<UIState>), replace?: false) => void;

const addNode = (set: Setter) => (node: Node) => {
    if (!node.parentId) return;

    node.id = nextId();
    set((state) => {
        const parentNode = state.nodes[node.parentId!];
        parentNode.children = [...(parentNode.children || []), node.id];

        return {
            nodes: { ...state.nodes, [node.id]: node, [node.parentId!]: parentNode },
        }
    });

    set((state) => {
        const parentNode = state.nodes[node.parentId!];
        const childUpateCallback = nodeRegistry.nodeInfoMap[parentNode.type]?.onChildUpdate;
        if (!childUpateCallback) return {};

        return childUpateCallback(node.parentId!, state);
    });
}

const setNodeProperty = (set: Setter) => (id: string, property: string, value: any) => {
    set((state) => {
        const node = state.nodes[id];
        node.properties = {...node.properties, [property]: value};
        return {nodes: {...state.nodes}};
    });
}

const rootNode: Node = newNode();
rootNode.id = "Node 0";
rootNode.parentId = undefined;

const useDragAndDropStore = create<UIState>((set) => ({
    rootNode: rootNode,
    nodes: { [rootNode.id]: rootNode },
    selectedNodeId: rootNode.id,
    draggedNodeId: undefined,
    addNode: addNode(set),
    updateNode: (id, updates) =>
        set((state) => ({
            nodes: {
                ...state.nodes,
                [id]: { ...state.nodes[id], ...updates },
            },
        })),
    removeNode: (id) =>
        set((state) => {
            const { [id]: _, ...remainingNodes } = state.nodes;
            return { nodes: remainingNodes };
        }),
    setDraggedNode: (id) => set({ draggedNodeId: id }),
    setHoverNode: (id) => set({ hoverNodeId: id}),
    setSelectedNode: (id) => set({ selectedNodeId: id }),
    setNodeProperty: setNodeProperty(set)
}));

export default useDragAndDropStore;