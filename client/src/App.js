import React, { Component } from 'react';
import Plug from './Plug';

class App extends Component {
  render() {
    return (
      <div>
        <nav>
          <h1>TP-Link REST API</h1>
        </nav>
        
        <div id="plugs-container"><Plug /></div>
      </div>
    );
  }
}

export default App;