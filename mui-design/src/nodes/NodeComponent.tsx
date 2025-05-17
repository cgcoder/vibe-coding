import React from "react";
import useDragAndDropStore, { type Node } from "./useDragAndDropStore";
import { Button, TextField } from "@mui/material";
import AddNodeButton from "./AddNodeButton";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

export interface NodeComponentProps {
    nodeId: string;
    children?: React.ReactNode; // Add this line to allow children
}

export const NodeComponent: React.FC<NodeComponentProps> = ({ nodeId }: NodeComponentProps) => {
    const { nodes } = useDragAndDropStore();
    const node = nodes[nodeId];
    const [hover, setHover] = React.useState(false);

    return renderComponent(node, hover);
}

function renderComponent(node: Node, hover: boolean): React.ReactNode {
    switch (node.type) {
        case 'button':
            return renderButton(node, hover);
        case 'span':
            return renderSpan(node, hover);
        case 'flex-column':
            return renderFlexColumn(node);
        case 'textbox':
            return renderTextBox(node);
        case 'flex-row':
            return renderFlexRow(node);
        case 'tab':
            return renderTab(node);
        default:
            return null;
    }
}

function renderButton(node: Node, hover: boolean): React.ReactNode {
    const { setSelectedNode } = useDragAndDropStore();
    const handleClick = () => {
        setSelectedNode(node.id);
    }
    return <Button {...node.properties} style={{ maxHeight: '20px' }} onClick={handleClick}>Button</Button>
}

function renderSpan(node: Node, hover: boolean): React.ReactNode {
    return <span style={{ color: 'black' }}>Span</span>
}

function renderTextBox(node: Node): React.ReactNode {
    return <div><TextField type="text" style={{ width: '100%' }} size="small" variant="outlined" label="Label" /></div>
}

function renderFlexColumn(node: Node): React.ReactNode {
    const { nodes, setHoverNode, hoverNodeId } = useDragAndDropStore();
    const childNode = node.children!.map(child => nodes[child]);
    const hover = hoverNodeId === node.id;
    const style = hover ? { border: '2px dashed #ccc' } : { border: '1px dashed #ccc' };
    return <div
        onMouseEnter={() => setHoverNode(node.id)}
        onMouseLeave={() => setHoverNode(undefined)}
        style={{
            position: 'relative', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '2px',
            margin: '2px', padding: '10px', minHeight: '20px', minWidth: '50px', ...style
        }}>
        {childNode.map((child) => {
            return <NodeComponent key={child.id} nodeId={child.id}></NodeComponent>
        })}
        {hover && (
            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', zIndex: 100 }}>
                <AddNodeButton nodeId={node.id} />
            </div>
        )}
    </div>
}

function renderFlexRow(node: Node): React.ReactNode {
    const { nodes, setHoverNode, hoverNodeId } = useDragAndDropStore();
    const childNode = node.children!.map(child => nodes[child]);
    const hover = hoverNodeId === node.id;
    const style = hover ? { border: '2px dashed #ccc' } : { border: '1px dashed #ccc' };
    return <div
        onMouseEnter={() => setHoverNode(node.id)}
        onMouseLeave={() => setHoverNode(undefined)}
        style={{
            position: 'relative', display: 'flex', margin: '2px',
            alignItems: 'center', justifyContent: 'center', gap: '2px',
            flexDirection: 'row', padding: '10px', minHeight: '20px', minWidth: '50px', ...style
        }}>
        {childNode.map((child) => {
            return <NodeComponent key={child.id} nodeId={child.id}></NodeComponent>
        })}
        {hover && (
            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', zIndex: 100 }}>
                <AddNodeButton nodeId={node.id} />
            </div>
        )}
    </div>
}

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
    const { nodes, setHoverNode, hoverNodeId } = useDragAndDropStore();
    const childNode = node.children!.map(child => nodes[child]);
    const hover = hoverNodeId === node.id;
    const style = hover ? { border: '2px dashed #ccc' } : { border: '1px dashed #ccc' };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div
            onMouseEnter={() => setHoverNode(node.id)}
            onMouseLeave={() => setHoverNode(undefined)}
            style={{
                position: 'relative', display: 'flex', margin: '2px',
                alignItems: 'center', justifyContent: 'center', gap: '2px',
                flexDirection: 'row', padding: '10px', minHeight: '20px', minWidth: '50px', ...style
            }}>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        {childNode.map((child, index) => {
                            return <Tab label={`Tab ${index}`} {...a11yProps(index)} />
                        })}
                    </Tabs>
                </Box>
                {childNode.map((child, index) => {
                    return <CustomTabPanel value={value} index={index}>
                            <NodeComponent key={child.id} nodeId={child.id}></NodeComponent>
                        </CustomTabPanel>
                })}
            </Box>
            {hover && (
                <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', zIndex: 100 }}>
                    <AddNodeButton nodeId={node.id} />
                </div>
            )}
        </div>
    );
}

function renderTab(node: Node): React.ReactNode {
    return <BasicTabs node={node} />;
}
