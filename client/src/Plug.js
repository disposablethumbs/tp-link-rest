import React, { Component } from 'react';
import './Plug.css';

class Plug extends Component {
  constructor(props){
    super(props);
    this.state = {
        msg: null,
        plugs: null
      };
    };

  componentDidMount() {
    this.getPlugs();
  }
    // Fetches our GET route from the Express server.
  callBackendAPI = async () => {
    const response = await fetch('/api/plugs');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }

    return body;
  };

  getPlugs() {
    this.callBackendAPI()
      .then(res => this.setState({ 
          msg: res.msg,
          plugs: res.plugs
    }))
      .catch(err => console.log(err));
  };

  activatePlug = (index, alias, action) => {
    console.log('Activating ' + alias);
    
    let spinner = document.getElementById("spinner-" + index);
    spinner.style.display = "block";

    fetch('api/plugs?alias=' + alias + '&action=' + action)
    .then(() => {
      this.getPlugs();
      spinner.style.display = "none";
    })
  };

  render() {
    var plugs = this.state.plugs;
    if(plugs){
        plugs = plugs.map((plug, index) => {
          let status = (plug.relay_state === 1 ? 'on' : 'off');
            return(
                <li key={index}>
                    <span className="title">{plug.alias}</span>
                    <span className="info">{plug.dev_name} - {plug.model}</span>
                    <span className="status">{status}<span className={status}></span></span>
                    <span className="buttons">
                        <button type="button" onClick={(e) => this.activatePlug(index, plug.alias, 'power-on')}>POWER ON</button>
                        <button type="button" onClick={(e) => this.activatePlug(index, plug.alias, 'power-off')}>POWER OFF</button>
                        <button type="button" onClick={(e) => this.activatePlug(index, plug.alias, 'toggle')}>TOGGLE</button>
                    </span>
                    <span className="loader">
                      <div id={"spinner-" + index} className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                    </span>
                </li>
            );
        });
    }
    else plugs = [
        <span key="no-plug" className="no-plugs">
          Looking for plugs...
        </span>
    ]

    return (
      <div>
        <ul>{plugs}</ul>
      </div>
    );
  }
}

export default Plug;