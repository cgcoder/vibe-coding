import type { NodeInfo, RenderContext } from "./registry";
import type { PropertySchema, Node } from "./node";
import useDragAndDropStore, { type UIState } from "./useDragAndDropStore";
import { NodeComponent } from "./NodeComponent";
import AddNodeButton from "./AddNodeButton";
import React from "react";
import { Box, Tabs, Tab } from "@mui/material";

export const newNode = () => {
    return {
        parentId: "",
        id: '',
        type: 'tab',
        children: [],
        properties: getProps(),
        propertySchema: {}
    };
};

const propertySchema: Record<string, PropertySchema> = {
    minWidth: {
        name: "minWidth",
        type: "string",
        label: "Min Width",
        default: "1px",
        description: "Minimum Width",
        editorStyleProps: {
            textAlign: "right",
        }
    },
    tabLabels: {
        name: "tabLabels",
        type: "string[]",
        label: "Tab Labels",
        default: "1px",
        description: "Labels for Tab",
        group: "Label"
    }
};

function getProps(): Record<string, any> {
  return {
    minWidth: "100%",
    tabLabels: []
  };
}

export const tabNodeInfo: NodeInfo = {
  type: "tab",
  propertySchema,
  newNode,
  render,
  onChildUpdate
};


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs({ node }: { node: Node }) {
    const [value, setValue] = React.useState(0);
    const { nodes, setHoverNode, hoverNodeId, selectedNodeId, setSelectedNode} = useDragAndDropStore();
    const childNode = node.children!.map(child => nodes[child]);
    const hover = hoverNodeId === node.id;
    const style = hover ? { border: '2px dashed blue' } : { border: '1px dashed #ccc' };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div
            onMouseEnter={() => setHoverNode(node.id)}
            onMouseLeave={() => setHoverNode(undefined)}
            onClick={(e) => { e.stopPropagation(); setSelectedNode(node.id);}}
            style={{
                position: 'relative', display: 'flex', padding: '5px',
                alignItems: 'center', justifyContent: 'center', gap: '2px',
                flexDirection: 'row', minHeight: '20px', minWidth: '50px', ...node.properties, ...style
            }}>
            <Box sx={{ width: '100%', ...node.properties }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        {childNode.map((child, index) => {
                            return <Tab label={node.properties["tabLabels"][index]} {...a11yProps(index)} />
                        })}
                    </Tabs>
                </Box>
                {childNode.map((child, index) => {
                    return <CustomTabPanel value={value} index={index} key={child.id}>
                            <NodeComponent key={child.id} nodeId={child.id}></NodeComponent>
                        </CustomTabPanel>
                })}
            </Box>
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
};

function render(node: Node, ctx: RenderContext): React.ReactNode {
    return <BasicTabs node={node} />;
}

function onChildUpdate(id: string, state: UIState): Partial<UIState> {
    const node = state.nodes[id];
    node.properties["tabLabels"].push("Tab Label");
    return {nodes: {...state.nodes}};
}