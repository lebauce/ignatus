import { hot } from "react-hot-loader/root";
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from "react-router-dom";
import App from './components/App';

const render = (Component) =>
  ReactDOM.render(
    <HashRouter>
      <Component />
    </HashRouter>,
    document.getElementById("root"));

render(hot(App));
