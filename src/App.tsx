import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes />
      </Layout>
    </BrowserRouter>
  );
};

export default App;
