import * as React from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import type { Node, PropertySchema } from "./node";
import type { NodeInfo, RenderContext } from "./registry";
import useDragAndDropStore from "./useDragAndDropStore";
import Icon from "./Icon";

export const newNode = () => {
  return {
    parentId: "",
    id: "",
    type: "list",
    children: [],
    properties: getProps(),
    propertySchema: {},
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
      width: "150px",
    },
  },
  width: {
    name: "width",
    type: "string",
    label: "Width",
    default: "1px",
    description: "Width",
    editorStyleProps: {
      textAlign: "right",
      width: "150px",
    },
  },
  subHeader: {
    name: "subHeader",
    type: "string",
    label: "Sub Header",
    default: "1px",
    description: "Header for the List",
  },
  items: {
    name: "items",
    type: "bigstring",
    label: "List Items",
    default: "1px",
    description: "Items in the List",
    group: "Label",
  },
};

function getProps(): Record<string, any> {
  return {
    minWidth: "100%",
    items: "",
    subHeader: "",
    width: "100%",
  };
}

interface NestedListProps {
  node: Node;
}

export const NestedList: React.FC<NestedListProps> = ({
  node,
}: NestedListProps) => {
  const [open, setOpen] = React.useState(true);
  const { nodes, setHoverNode, hoverNodeId, setSelectedNode, selectedNodeId } =
    useDragAndDropStore();
  const childNode = node.children!.map((child) => nodes[child]);

  const listItems = parseListItems(node.properties["items"]);

  const hover = hoverNodeId === node.id;
  let style =
    selectedNodeId === node.id
      ? { border: "2px dashed lightblue" }
      : hover
      ? { border: "2px dashed blue" }
      : { border: "1px dashed #ccc" };
  const subHeader = node.properties["subHeader"] ?? null;
  style = { ...style, ...node.properties };
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      onClick={(e) => {
        setSelectedNode(node.id);
        e.stopPropagation();
      }}
      style={{ ...style }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        subHeader && (
          <ListSubheader component="div" id="nested-list-subheader">
            {subHeader}
          </ListSubheader>
        )
      }
    >
      {listItems.map((li, i) => <ListItemControl item={li} key={i} padding={0} />)}
    </List>
  );
};

interface ListItemControlProps {
    item: ListItem;
    padding: number;
};

const ListItemControl: React.FC<ListItemControlProps> = ({item, padding}) => {
    const [open, setOpen] = React.useState(true);
    const handleClick = () => {
    setOpen(!open);
  };

    return <>
    <ListItemButton onClick={handleClick} sx={{pl: padding === 0 ? 2 : padding }}>
        {item.icon && <ListItemIcon>
          <Icon name={item.icon} />
        </ListItemIcon>}
        <ListItemText primary={item.text} />
        {item.children?.length > 0 && (open ? <ExpandLess /> : <ExpandMore />)}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {item.children.map((ci, i) => <ListItemControl item={ci} key={i} padding={padding + 4} />)}  
        </List>
      </Collapse>
    </>
}

function render(node: Node, ctx: RenderContext): React.ReactNode {
  return <NestedList node={node} />;
}

export const listNodeInfo: NodeInfo = {
  type: "list",
  propertySchema,
  newNode,
  render,
};

interface ListItem {
    text: string;
    icon: string;
    children: ListItem[]
}

function parseListItems(str: string): ListItem[] {
    if (!str.trim()) return [];
    const lines = str.split('\n').filter(line => line.trim() !== '');
    const stack: { indent: number; item: ListItem }[] = [];
    const result: ListItem[] = [];

    for (const line of lines) {
        const match = line.match(/^(\s*)([^,]+),(.*)$/);
        if (!match) continue;
        const indent = match[1].length;
        const icon = match[3].trim();
        const text = match[2].trim();
        const item: ListItem = { text, icon, children: [] };

        while (stack.length && stack[stack.length - 1].indent >= indent) {
            stack.pop();
        }

        if (stack.length === 0) {
            result.push(item);
        } else {
            stack[stack.length - 1].item.children.push(item);
        }
        stack.push({ indent, item });
    }

    return result;
}