import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Authors from '../pages/Authors';
import AuthorForm from '../pages/Authors/AuthorForm';
import BookForm from '../pages/Book';
import Dashboard from '../pages/Dashboard';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" exact component={Dashboard} />
      <Route path="/book" exact component={BookForm} />
      <Route path="/book/:id" exact component={BookForm} />
      <Route path="/authors" exact component={Authors} />
      <Route path="/author" exact component={AuthorForm} />
      <Route path="/author/:id" exact component={AuthorForm} />
    </Switch>
  );
};
export default Routes;
