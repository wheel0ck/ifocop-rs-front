/* eslint-disable no-undef */
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './components/Login';

window.APP = {};
window.APP.getState = '';
window.APP.setState = '';

window.APP.reducer = (action) => {
  switch (action.type) {
    case 'GETSTATE':
      console.log('GETSTATE');
      return APP.getState();
    default:
      return console.log('default reducer');
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = { token: undefined};
    this.getState = this.getState.bind(this);
    window.APP.getState = this.getState;
    this.dispatch = this.dispatch.bind(this);
    window.APP.setState = this.dispatch;
  }

  dispatch(value) {
    this.setState(value);
  }
  getState() {
    return this.state;
  }

  render() {
    return (
      <div>
        <Login />
      </div>
    );
  }
}

export default App;
