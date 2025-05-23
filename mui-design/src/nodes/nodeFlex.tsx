import type { NodeInfo, RenderContext } from "./registry";
import { type PropertySchema, type EnumPropertySchema, type Node, type TuplePropertySchema, defaultProps, defaultPropsSchema, nodeSize, nodePadding } from "./node";
import useDragAndDropStore from "./useDragAndDropStore";
import { NodeComponent } from "./NodeComponent";
import AddNodeButton from "./AddNodeButton";
import { arrToObj, nodeStyle } from "./utils";

export const newNode = () => {
  return {
    parentId: "",
    id: "",
    type: "flex",
    children: [],
    properties: getProps(),
    propertySchema,
  };
};

const propertySchema: Record<string, PropertySchema> = {
    ...defaultPropsSchema,
    direction: {
        name: "direction",
        type: "enum",
        label: "Direction",
        default: "row",
        description: "Direction flex",
        section: "Flex",
        options: ["row", "column", "row-reverse", "column-reverse"],
    } as EnumPropertySchema,
    gap: {
        name: "gap",
        type: "tuple",
        label: "Gap",
        default: "1px",
        description: "Gap",
        tupleCount: 2,
        tupleLabel: ["Row Gap", "Col Gap"],
        editorStyleProps: {
            "maxWidth": "120px"
        },
        section: "Gap"
    } as TuplePropertySchema,
    justifyContent: {
        name: "justifyContent",
        type: "enum",
        label: "Justify Items",
        default: "flex-start",
        description: "Configure how spaces are distributed.",
        options: [
            "flex-start",
            "flex-end",
            "center",
            "space-between",
            "space-around",
            "space-evenly",
            "start",
            "end",
            "left",
            "right"
        ],
        section: "Flex"
    } as EnumPropertySchema,
    alignItems: {
        name: "alignItems",
        type: "enum",
        label: "Align Items",
        default: "center",
        description: "Configure align items for flexbox.",
        options: [
            "stretch", "center", "start", "end"
        ],
        section: "Flex"
    } as EnumPropertySchema,
    alignSelf: {
        name: "alignSelf",
        type: "enum",
        label: "Align Self",
        default: "auto",
        description: "Override align-items for individual flex items.",
        options: [
            "auto",
            "flex-start",
            "flex-end",
            "center",
            "baseline",
            "stretch"
        ],
        section: "Flex"
    } as EnumPropertySchema,
    alignContent: {
        name: "alignContent",
        type: "enum",
        label: "Align Content",
        default: "flex-start",
        description: "Configure align content for flexbox.",
        options: [
            "flex-start",
            "flex-end",
            "center",
            "space-between",
            "space-around",
            "space-evenly",
            "stretch"
        ],
        section: "Flex"
    } as EnumPropertySchema,
    flexWrap: {
        name: "flexWrap",
        type: "enum",
        label: "Flex Wrap",
        default: "nowrap",
        description: "Control whether flex items wrap onto multiple lines.",
        options: [
            "nowrap",
            "wrap",
            "wrap-reverse"
        ],
        section: "Flex"
    } as EnumPropertySchema,
};

function getProps(): Record<string, any> {
  return {
    ...defaultProps,
    direction: "column",
    gap: ["10px", ""],
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    alignContent: "center",
    flexWrap: "wrap",
  };
}

export const flexNodeInfo: NodeInfo = {
  type: "flex",
  propertySchema,
  newNode,
  render,
};

function render(node: Node, ctx: RenderContext): React.ReactNode {
  const { nodes, setHoverNode, hoverNodeId, setSelectedNode, selectedNodeId, mode } = useDragAndDropStore();
  const childNode = node.children!.map((child) => nodes[child]);
  const hover = hoverNodeId === node.id;
  const isPreview = mode === "preview";
  let style = isPreview ? {} : 
          (selectedNodeId === node.id ? 
              ({ border: "2px dashed lightblue" }) : 
                  (hover
                        ? { border: "2px dashed blue" }
                        : { border: "1px dashed #ccc" }));


  const validProps = Object.fromEntries(
    Object.entries(node.properties).filter(
      ([_, value]) => value !== "" && value != null
    )
  );

  style = {...style, ...nodeSize(node), ...nodePadding(node), ...arrToObj(node.properties["gap"], "rowGap", "columnGap"), ...nodeStyle(node)};

  return (
    <div
      onMouseEnter={() => setHoverNode(node.id)}
      onMouseLeave={() => setHoverNode(undefined)}
      onClick={(e) => { console.log('clicked', node.id); setSelectedNode(node.id); e.stopPropagation();}}
      data-metadata-type="flex"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: node.properties["direction"],
        alignItems: "center",
        justifyContent: "center",
        minHeight: "1px",
        minWidth: "50px",
        ...style,
        ...validProps,
      }}
    >
      {childNode.map((child) => {
        return <NodeComponent key={child.id} nodeId={child.id}></NodeComponent>;
      })}
      {selectedNodeId === node.id && (
        <div
          style={{
            position: "absolute",
            top: '0%',
            right: '0%',
            transform: "translate(0%, 0%)",
            zIndex: 100,
          }}
        >
          <AddNodeButton nodeId={node.id} />
        </div>
      )}
    </div>
  );
}
