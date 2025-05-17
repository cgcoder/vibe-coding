import { useState } from 'react';
import './App.css';
import { RootNode } from './nodes/RootNode';
import { PropertiesPanel } from './Properties';

function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* Left Panel */}
      <div style={{ minWidth: '300px', backgroundColor: '#202020', 
            padding: '10px', boxSizing: 'border-box' }}>
        <h3>Available Tools</h3>
        <ul>
          <li>Tool 1</li>
          <li>Tool 2</li>
          <li>Tool 3</li>
        </ul>
        <PropertiesPanel />
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, backgroundColor: '#ffffff', padding: '10px' }}>
        <div id='design-area' style={{ border: '2px dashed #ccc', height: '100%' }}>
          <RootNode />
        </div>
      </div>
    </div>
  );
}

export default App;
