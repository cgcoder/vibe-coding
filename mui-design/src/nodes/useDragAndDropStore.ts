import { create } from 'zustand';

export interface Node {
    id: string; // Unique identifier
    type: string; // Type of the node (e.g., 'button', 'input', etc.)
    parentId?: string; // Parent node ID for nested structures
    children?: string[]; // Array of child node IDs
    properties?: Record<string, any>; // Additional properties (e.g., label, color)
    propertySchema: Record<string, any>;
}

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
    })
}

const rootNode: Node = {
    id: 'root',
    parentId: undefined,
    type: 'root',
    children: [],
    properties: {},
    propertySchema: {},
}

const useDragAndDropStore = create<UIState>((set) => ({
    rootNode: rootNode,
    nodes: { [rootNode.id]: rootNode },
    selectedNodeId: undefined,
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
    setSelectedNode: (id) => set({ selectedNodeId: id })
}));

export default useDragAndDropStore;