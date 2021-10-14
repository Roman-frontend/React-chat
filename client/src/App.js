import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { routesCreater } from './routes';
import './css/style.sass';

export default function App() {
  return (
    <Router>
      <Switch>{routesCreater()}</Switch>
    </Router>
  );
}
