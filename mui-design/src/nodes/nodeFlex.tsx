import type { NodeInfo, RenderContext } from "./registry";
import { type PropertySchema, type EnumPropertySchema, type Node, type TuplePropertySchema, defaultProps, defaultPropsSchema } from "./node";
import useDragAndDropStore from "./useDragAndDropStore";
import { NodeComponent } from "./NodeComponent";
import AddNodeButton from "./AddNodeButton";

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
        options: ["row", "column", "row-reverse", "column-reverse"],
    } as EnumPropertySchema,
    padding: {
        name: "padding",
        type: "tuple",
        label: "Padding",
        default: "5px 5px 5px 5px",
        description: "Padding",
        tupleCount: 4,
        tupleLabel: ["Top", "Right", "Bottom", "Left"],
        editorStyleProps: {
            "maxWidth": "100px"
        },
        group: "Padding"
    } as TuplePropertySchema,
    gap: {
        name: "gap",
        type: "tuple",
        label: "Gap",
        default: "1px",
        description: "Gap",
        tupleCount: 2,
        tupleLabel: ["Row Gap", "Col Gap"],
        editorStyleProps: {
            "maxWidth": "100px"
        },
        group: "Gap"
    } as TuplePropertySchema,
    width: {
        name: "width",
        type: "string",
        label: "Width",
        default: "1px",
        description: "Width",
        editorStyleProps: {
            textAlign: "right",
            width: "100%"
        },
        group: "Size"
    },
    height: {
        name: "height",
        type: "string",
        label: "Height",
        default: "1px",
        description: "Height",
        editorStyleProps: {
            textAlign: "right",
            width: "100%"
        },
        group: "Size"
    },
    justifyContent: {
        name: "justifyContent",
        type: "enum",
        label: "Justify Items",
        default: "center",
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
        group: "Flex"
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
        group: "Flex"
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
        group: "Flex"
    } as EnumPropertySchema,
    alignContent: {
        name: "alignContent",
        type: "enum",
        label: "Align Content",
        default: "center",
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
        group: "Flex"
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
        group: "Flex"
    } as EnumPropertySchema,
};

function getProps(): Record<string, any> {
  return {
    ...defaultProps,
    direction: "column",
    padding: "5px 5px 5px 5px",
    gap: "10px",
    width: "100%",
    height: "",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "",
    alignContent: "",
    flexWrap: "",
  };
}

export const flexNodeInfo: NodeInfo = {
  type: "flex",
  propertySchema,
  newNode,
  render,
};

function render(node: Node, ctx: RenderContext): React.ReactNode {
  const { nodes, setHoverNode, hoverNodeId, setSelectedNode, selectedNodeId } = useDragAndDropStore();
  const childNode = node.children!.map((child) => nodes[child]);
  const hover = hoverNodeId === node.id;
  const style = selectedNodeId === node.id ? ({ border: "2px dashed lightblue" }) : (hover
    ? { border: "2px dashed blue" }
    : { border: "1px dashed #ccc" });


  const validProps = Object.fromEntries(
    Object.entries(node.properties).filter(
      ([_, value]) => value !== "" && value != null
    )
  );

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
        padding: "10px",
        minHeight: "20px",
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
