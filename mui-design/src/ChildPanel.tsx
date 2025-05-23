import { Collapse, Link, List, ListItemButton, ListItemText, ListItemIcon } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import useDragAndDropStore from "./nodes/useDragAndDropStore";
import React from "react";

interface ChildPanelProps {
    id: string;
    pl: number | undefined;
}

const ChildPanel: React.FC<ChildPanelProps> = ({ id, pl }) => {
    pl = pl ?? 0;
    const { nodes, setSelectedNode, selectedNodeId } = useDragAndDropStore();
    const node = nodes[id]!;
    const children = node.children ?? [];
    const selected = selectedNodeId === id;
    const [open, setOpen] = React.useState(true);

    const handleOpen = (e: React.MouseEvent) => {
        e.stopPropagation();
        setOpen(!open);
    };

    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedNode(id);
    };

    const styles = selected ? { background: "#FFF9C4" } : {};

    return (
        <List>
            <ListItemButton onClick={handleOpen} sx={{ pl: pl + 1, height: 30 }} style={styles}>
                    {children.length > 0 && <ListItemIcon sx={{ minWidth: 32, pl }}>
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemIcon>}
                <Link
                    href="#"
                    onClick={handleSelect}
                    style={{ textDecoration: "none", flex: 1, paddingLeft: (children.length) === 0 ? (pl + 44) : 0 }}
                    underline="none"
                >
                    {node.properties["name"]?.length > 0 ? node.properties["name"] : node.id}
                </Link>
            </ListItemButton>
            {children.map((c) => (
                <Collapse key={c} in={open} timeout="auto">
                    <List component="div" disablePadding>
                        <ChildPanel id={c} pl={pl + 1} />
                    </List>
                </Collapse>
            ))}
        </List>
    );
};

export default ChildPanel;
