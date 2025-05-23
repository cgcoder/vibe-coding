// ... (rest of your imports and
import { nextId, type Node } from "./node";
import { nodeRegistry } from "./registry";
import { newNode } from "./nodeFlex";
import { create } from "zustand";

export interface UIState {
  rootNode: Node;
  mode: string;
  filename: string;
  collapsedSections: string[];
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
  deleteNode: (id: string) => void;
  moveNode: (id: string, step: number | "first" | "last") => void; // Move a node one position before in parent's children array
  duplicateNode: (id: string) => void;
  setMode: (mode: string) => void;
  setFilename: (name: string) => void;
  toggleSection: (name: string) => void;
  setNodes: (nodes: Record<string, Node>) => void;

}

type Setter = (
  partial:
    | UIState
    | Partial<UIState>
    | ((state: UIState) => UIState | Partial<UIState>),
  replace?: false
) => void;

const addNode = (set: Setter) => (node: Node) => {
  if (!node.parentId) return;

  node.id = nextId();
  set((state) => {
    const parentNode = state.nodes[node.parentId!];
    parentNode.children = [...(parentNode.children || []), node.id];

    return {
      nodes: { ...state.nodes, [node.id]: node, [node.parentId!]: parentNode },
    };
  });

  set((state) => {
    const parentNode = state.nodes[node.parentId!];
    const childUpateCallback =
      nodeRegistry.nodeInfoMap[parentNode.type]?.onChildUpdate;
    if (!childUpateCallback) return {};

    return childUpateCallback(node.parentId!, state);
  });
};

const setNodeProperty =
  (set: Setter) => (id: string, property: string, value: any) => {
    set((state) => {
      const node = state.nodes[id];
      node.properties = { ...node.properties, [property]: value };
      return { nodes: { ...state.nodes } };
    });
  };

const deleteNode = (set: Setter) => (id: string) => {
  set((state) => {
    const node = state.nodes[id];
    if (!node.parentId) return state;
    const parentNode = state.nodes[node.parentId];
    const nodes = state.nodes;
    delete nodes[id];
    parentNode.children = parentNode.children?.filter((n) => n !== id);
    return { nodes: { ...nodes } };
  });
};

const moveNode =
  (set: Setter) => (id: string, step: number | "first" | "last") =>
    set((state) => {
      const node = state.nodes[id];
      if (!node || !node.parentId) return {};
      const parent = state.nodes[node.parentId];
      if (!parent || !parent.children) return {};
      let newChildren: string[] = [];
      if (step === "first") {
        newChildren = [id, ...parent.children.filter((i) => i !== id)];
      } else if (step === "last") {
        newChildren = [...parent.children.filter((i) => i !== id), id];
      } else {
        const idx = parent.children.indexOf(id);
        const newIdx = idx + step;
        if (newIdx < 0 || newIdx >= parent.children.length) return {};
        // Swap with previous sibling
        newChildren = [...parent.children];
        [newChildren[idx], newChildren[newIdx]] = [
          newChildren[newIdx],
          newChildren[idx],
        ];
      }

      return {
        nodes: {
          ...state.nodes,
          [parent.id]: { ...parent, children: newChildren },
        },
      };
    });

const duplicateNode = (set: Setter) => (id: string) => {
    set((state) => {
      const node = state.nodes[id];
      if (!node || !node.parentId) return {};
      let newNodes: Record<string, Node> = {};
      let clonePairMap: Record<string, string> = {};
      const cloneOrder: string[] = [];
      getNodesToClone(state, node.id, cloneOrder);

      cloneNode(cloneOrder, state, newNodes, clonePairMap);
      const newId = clonePairMap[cloneOrder[0]];

      updateClonedNodes(cloneOrder, newNodes, clonePairMap);

      newNodes[newId].parentId = node.parentId;
      
      state.nodes[node.parentId].children?.push(newId);
      const outState = {nodes: {...state.nodes, ...newNodes}};
      return outState;
    });
}

const getNodesToClone = (state: UIState, id: string, cloneOrderId: string[]) => {
    const traverseId = [id];

    while (traverseId.length > 0) {
        const currentId = traverseId.shift()!;
        cloneOrderId.push(currentId);
        const node = state.nodes[currentId];
        if (node && node.children) {
            traverseId.push(...node.children);
        }
    }
    
}

const cloneNode = (cloneOrder: string[], state: UIState, newNodes: Record<string, Node>, clonePairMap: Record<string, string>) => {

    for (let nodeId of cloneOrder) {
        const node = state.nodes[nodeId];

        const newNode = JSON.parse(JSON.stringify(node));
        newNode.id = nextId();

        clonePairMap[newNode.id] = node.id;
        clonePairMap[node.id] = newNode.id;
        newNodes[newNode.id] = newNode;

    }

}

const updateClonedNodes = (cloneOrder: string[], newNodes: Record<string, Node>, clonePairMap: Record<string, string>) => {
    for (let oldId of cloneOrder) {
        const newId = clonePairMap[oldId];
        const newNode = newNodes[newId];

        newNode.children = newNode.children!.map(c => clonePairMap[c]);
        const newParentId = clonePairMap[newNode.parentId!];
        if (newParentId) {
            newNode.parentId = newParentId;
        }
    }
}

const setMode = (set: Setter) => (mode: string) => {
    set((state) => ({ mode: mode}));
}

const setFilename = (set: Setter) => (name: string) => {
    set((state) => ({ filename: name}));
}

const toggleSection = (set: Setter) => (section: string) => {
    set((state) => ({collapsedSections: state.collapsedSections.indexOf(section) >= 0 ? state.collapsedSections.filter(i => i !== section) : [...state.collapsedSections, section]}))
}

const setNodes = (set: Setter) => (nodes: Record<string, Node>) => {
    set((state) => ({collapsedSections: [], nodes: nodes, selectedNodeId: undefined, hoverNodeId: undefined}));
}

const rootNode: Node = newNode();
rootNode.id = "Node 0";
rootNode.parentId = undefined;

const useDragAndDropStore = create<UIState>((set) => ({
  rootNode: rootNode,
  mode: "",
  filename: "untitled",
  collapsedSections: [],
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
  setHoverNode: (id) => set({ hoverNodeId: id }),
  setSelectedNode: (id) => set({ selectedNodeId: id }),
  setNodeProperty: setNodeProperty(set),
  deleteNode: deleteNode(set),
  moveNode: moveNode(set),
  duplicateNode: duplicateNode(set),
  setMode: setMode(set),
  setFilename: setFilename(set),
  toggleSection: toggleSection(set),
  setNodes: setNodes(set),
}));

export default useDragAndDropStore;
