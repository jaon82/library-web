import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Routes from './routes';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes />
    </BrowserRouter>
  );
};

export default App;
