import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Book from '../pages/Book';
import Dashboard from '../pages/Dashboard';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={Dashboard} />
      <Route path="/book" exact component={Book} />
    </Switch>
  );
};
export default Routes;
