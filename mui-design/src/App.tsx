import React, { useState } from "react";
import "./App.css";
import { RootNode } from "./nodes/RootNode";
import { PropertiesPanel } from "./Properties";
import { nodeRegistry, validateRegistry } from "./nodes/registry";
import { buttonNodeInfo } from "./nodes/nodeButton";
import { flexNodeInfo } from "./nodes/nodeFlex";
import { tabNodeInfo } from "./nodes/nodeTab";
import { textFieldNodeInfo } from "./nodes/nodeTextField";
import { listNodeInfo } from "./nodes/nodeList";
import { checkboxNodeInfo } from "./nodes/nodeCheckbox";
import { radiogroupNodeInfo } from "./nodes/nodeRadioGroup";
import { typographyNodeInfo } from "./nodes/nodeTypography";
import { tableNodeInfo } from "./nodes/nodeTable";
import { dividerNodeInfo } from "./nodes/nodeDivider";
import { dropdownNodeInfo } from "./nodes/nodeDropdown";
import { Box, createTheme, TextField, ThemeProvider } from "@mui/material";
import Toolbar from "./Toolbar";
import useDragAndDropStore from "./nodes/useDragAndDropStore";
import { imageNodeInfo } from "./nodes/nodeImage";
import { chipsNodeInfo } from "./nodes/nodeChips";

const theme = createTheme({
  spacing: 5,
  components: {
    MuiButton: {
      defaultProps: {
        size: "small",
      },
    },
    MuiFilledInput: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiFormControl: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiFormHelperText: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: "small",
      },
    },
    MuiInputBase: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiInputLabel: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiListItem: {
      defaultProps: {
        dense: true,
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiFab: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTable: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTextField: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiToolbar: {
      defaultProps: {
        variant: "dense",
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
        {/* Left Panel */}
        <div
          style={{ flex: 1, maxHeight: "100vh" }}
        >
          <Box
            width="100%"
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Filename />
            <Toolbar />
          </Box>
          <div
            id="design-area"
            style={{ border: "2px dashed #ccc", minHeight: "30%" }}
          >
            <RootNode />
          </div>
        </div>

        {/* Right Panel */}
        <div
          style={{
            minWidth: "300px",
            maxWidth: "300px",
            backgroundColor: "#FAFAFA",
            maxHeight: "100vh",
            overflow: "scroll",
          }}
        >
          <div style={{ boxSizing: "border-box" }}>
            <PropertiesPanel />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

const Filename = () => {
  const { filename, setFilename } = useDragAndDropStore();
  const [editable, setEditable] = React.useState(false);
  const [localname, setLocalname] = React.useState(filename);

  if (editable) {
    return (
      <TextField
        value={localname}
        onChange={(e) => setLocalname(e.target.value ?? "")}
        onBlur={() => {
          setEditable(false);
          setFilename(localname);
        }}
      ></TextField>
    );
  }

  return (
    <Box pl="10px" onClick={(e) => setEditable(true)}>
      {filename}
    </Box>
  );
};

(() => {
  nodeRegistry.registerNode(buttonNodeInfo);
  nodeRegistry.registerNode(flexNodeInfo);
  nodeRegistry.registerNode(tabNodeInfo);
  nodeRegistry.registerNode(textFieldNodeInfo);
  nodeRegistry.registerNode(listNodeInfo);
  nodeRegistry.registerNode(checkboxNodeInfo);
  nodeRegistry.registerNode(radiogroupNodeInfo);
  nodeRegistry.registerNode(typographyNodeInfo);
  nodeRegistry.registerNode(tableNodeInfo);
  nodeRegistry.registerNode(dividerNodeInfo);
  nodeRegistry.registerNode(dropdownNodeInfo);
  nodeRegistry.registerNode(imageNodeInfo);
  nodeRegistry.registerNode(chipsNodeInfo);
  validateRegistry();
})();

export default App;
