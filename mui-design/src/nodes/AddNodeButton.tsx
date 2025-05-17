import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import {Menu, type MenuProps} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { KeyboardArrowDown } from '@mui/icons-material';
import useDragAndDropStore, {type Node} from './useDragAndDropStore';
import { newButtonNode, newSpanNode, newFlexColumnNode, newFlexRowNode, newTextNode, newTabNode } from './nodes';

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: 'rgb(55, 65, 81)',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
    ...theme.applyStyles('dark', {
      color: theme.palette.grey[300],
    }),
  },
}));

interface AddNodeButtonProps {
    nodeId: string;
}

export default function AddNodeButton({nodeId}: AddNodeButtonProps) {
  const { addNode } = useDragAndDropStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddNode = (node: Node) => {
    addNode(node);
    handleClose();
  };

  return (
    <div style={{ padding: '5px'}}>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        size="small"
        color='secondary'
        endIcon={<KeyboardArrowDown />}
      >+
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleAddNode(newButtonNode(nodeId))}>
            Button
        </MenuItem>
        <MenuItem onClick={() => handleAddNode(newSpanNode(nodeId))}>
            Span
        </MenuItem>
        <MenuItem onClick={() => handleAddNode(newTextNode(nodeId))}>
            TextBox 
        </MenuItem>
        <MenuItem onClick={() => handleAddNode(newFlexColumnNode(nodeId))}>
           Flex (Column) 
        </MenuItem>
        <MenuItem onClick={() => handleAddNode(newFlexRowNode(nodeId))}>
           Flex (Row) 
        </MenuItem>
        <MenuItem onClick={() => handleAddNode(newTabNode(nodeId))}>
            Tab
        </MenuItem>
        <MenuItem onClick={handleClose}>
            List
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleClose}>
            Edit
        </MenuItem>
        <MenuItem onClick={handleClose}>
          More
        </MenuItem>
      </StyledMenu>
    </div>
  );
}