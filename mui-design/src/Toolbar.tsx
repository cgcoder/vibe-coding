import React from 'react';
import { Toolbar as MuiToolbar, IconButton, Tooltip, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import WidthFullIcon from '@mui/icons-material/WidthFull';
import HeightIcon from '@mui/icons-material/Height';
import useDragAndDropStore from './nodes/useDragAndDropStore';
import { FileOpen, PreviewOutlined, SaveOutlined, UpgradeOutlined } from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { nextId, nextIdAsNumber, setNextId } from './nodes/node';

const deleteColor = '#e53935'; // red
const iconColor = '#1976d2'; // blue for all except delete

const SaveDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    const { nodes } = useDragAndDropStore();
    const [fileName, setFileName] = React.useState("");
    const handleSave = () => {
        localStorage.setItem(fileName, JSON.stringify({nodes: nodes, nextId: nextIdAsNumber()}));
        onClose();
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Save Node</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="File Name"
                    type="text"
                    fullWidth
                    value={fileName}
                    onChange={e => setFileName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

const OpenDialog: React.FC<{ open: boolean; onClose: () => void; onLoad: (nodes: any) => void }> = ({ open, onClose, onLoad }) => {
    const [keys, setKeys] = React.useState<string[]>([]);
    const [hoveredKey, setHoveredKey] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (open) {
            const allKeys = Object.keys(localStorage);
            setKeys(allKeys);
        }
    }, [open]);

    const handleSelect = (key: string) => {
        const data = localStorage.getItem(key);
        if (data) {
            try {
                const parsed = JSON.parse(data);
                onLoad(parsed);
                onClose();
            } catch (e) {
                alert('Failed to load data');
                console.error(e);
            }
        }
    };

    const handleDelete = (key: string) => {
        localStorage.removeItem(key);
        setKeys(prev => prev.filter(k => k !== key));
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Open Saved Nodes</DialogTitle>
            <DialogContent>
                <List>
                    {keys.length === 0 && <ListItem><ListItemText primary="No saved items" /></ListItem>}
                    {keys.map(key => (
                        <ListItem
                            key={key}
                            disablePadding
                            onMouseEnter={() => setHoveredKey(key)}
                            onMouseLeave={() => setHoveredKey(null)}
                            secondaryAction={
                                hoveredKey === key && (
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(key)}>
                                        <DeleteIcon sx={{ color: '#e53935' }} />
                                    </IconButton>
                                )
                            }
                        >
                            <ListItemButton onClick={() => handleSelect(key)}>
                                <ListItemText primary={key} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

const Toolbar: React.FC = () => {
    const {selectedNodeId, deleteNode, moveNode, duplicateNode, setMode, mode, setSelectedNode, nodes, setNodes} = useDragAndDropStore();
    const selectedNode = selectedNodeId && nodes[selectedNodeId];
    const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);
    const [openDialogOpen, setOpenDialogOpen] = React.useState(false);

    const handleSave = () => setSaveDialogOpen(true);
    const handleSaveDialogClose = () => setSaveDialogOpen(false);

    const handleOpen = () => setOpenDialogOpen(true);
    const handleOpenDialogClose = () => setOpenDialogOpen(false);

    const handleLoadNodes = (loadedNodes: any) => {
        setNextId(loadedNodes.nextId);
        setNodes(loadedNodes.nodes);
        console.log('loaded data', loadedNodes);
    };

    const handleDelete = () => selectedNodeId && deleteNode(selectedNodeId);
    const handleParent = () => selectedNodeId && selectedNode && selectedNode.parentId && setSelectedNode(selectedNode.parentId!);
    const handleMoveUp = () => selectedNodeId && moveNode(selectedNodeId, -1);
    const handleMoveDown = () => selectedNodeId && moveNode(selectedNodeId, 1);
    const handleMoveToStart = () => selectedNodeId && moveNode(selectedNodeId, "first");
    const handleMoveToEnd = () => selectedNodeId && moveNode(selectedNodeId, "last");
    const handleEqualWidth = () => { /* TODO: implement equal width */ };
    const handleEqualHeight = () => { /* TODO: implement equal height */ };
    const handleDuplicate = () => selectedNodeId && duplicateNode(selectedNodeId);
    const handlePreview = () => mode === "preview" ? setMode("") : setMode("preview");

    return (
        <MuiToolbar>
            <Box display="flex" gap={1}>
                <Tooltip title="Save">
                    <IconButton onClick={handleSave}>
                        <SaveOutlined sx={{ color: iconColor }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Open">
                    <IconButton onClick={handleOpen}>
                        <FileOpen sx={{ color: iconColor }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton onClick={handleDelete}>
                        <DeleteIcon sx={{ color: deleteColor }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Select Parent">
                    <IconButton onClick={handleParent}>
                        <UpgradeOutlined sx={{ color: iconColor }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Move Up">
                    <IconButton onClick={handleMoveUp}>
                        <ArrowUpwardIcon sx={{ color: iconColor }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Move Down">
                    <IconButton onClick={handleMoveDown}>
                        <ArrowDownwardIcon sx={{ color: iconColor }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Move to Start">
                    <IconButton onClick={handleMoveToStart}>
                        <FirstPageIcon sx={{ color: iconColor }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Move to End">
                    <IconButton onClick={handleMoveToEnd}>
                        <LastPageIcon sx={{ color: iconColor }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Equal Width">
                    <IconButton onClick={handleEqualWidth}>
                        <WidthFullIcon sx={{ color: iconColor }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Equal Height">
                    <IconButton onClick={handleEqualHeight}>
                        <HeightIcon sx={{ color: iconColor }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Duplicate">
                    <IconButton onClick={handleDuplicate}>
                        <ContentCopyIcon sx={{ color: iconColor }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Preview">
                    <IconButton onClick={handlePreview}>
                        <PreviewOutlined sx={{ color: iconColor }} />
                    </IconButton>
                </Tooltip>
            </Box>
            <SaveDialog open={saveDialogOpen} onClose={handleSaveDialogClose} />
            <OpenDialog open={openDialogOpen} onClose={handleOpenDialogClose} onLoad={handleLoadNodes} />
        </MuiToolbar>
    );
};

export default Toolbar;
/**
 * No code needed here, changes are within OpenDialog above.
 * Update OpenDialog to add delete functionality.
 */

 