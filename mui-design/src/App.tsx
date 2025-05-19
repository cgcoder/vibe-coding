import { useState } from 'react';
import './App.css';
import { RootNode } from './nodes/RootNode';
import { PropertiesPanel } from './Properties';
import { nodeRegistry, validateRegistry } from './nodes/registry';
import { buttonNodeInfo } from './nodes/nodeButton';
import { flexNodeInfo } from './nodes/nodeFlex';
import { tabNodeInfo } from './nodes/nodeTab';
import { textFieldNodeInfo } from './nodes/nodeTextField';
import { listNodeInfo } from './nodes/nodeList';
import { checkboxNodeInfo } from './nodes/nodeCheckbox';
import { radiogroupNodeInfo } from './nodes/nodeRadioGroup';
import { typographyNodeInfo } from './nodes/nodeTypography';

function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* Left Panel */}
      <div style={{ minWidth: '300px', maxWidth: '300px', backgroundColor: '#DFDFDF', maxHeight: '100vh', overflow: "scroll",
            padding: '10px' }}>
        <div style={{ minWidth: '300px', backgroundColor: '#DFDFDF', 
            padding: '10px', boxSizing: 'border-box' }}>
            <PropertiesPanel />
        </div>

      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, backgroundColor: '#ffffff', padding: '10px', maxHeight: '100vh' }}>
        <div id='design-area' style={{ border: '2px dashed #ccc', height: '100%' }}>
          <RootNode />
        </div>
      </div>
    </div>
  );
}

(() => {
  nodeRegistry.registerNode(buttonNodeInfo);
  nodeRegistry.registerNode(flexNodeInfo);
  nodeRegistry.registerNode(tabNodeInfo);
  nodeRegistry.registerNode(textFieldNodeInfo);
  nodeRegistry.registerNode(listNodeInfo);
  nodeRegistry.registerNode(checkboxNodeInfo);
  nodeRegistry.registerNode(radiogroupNodeInfo);
  nodeRegistry.registerNode(typographyNodeInfo);
  validateRegistry();
})();


export default App;
