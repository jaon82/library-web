import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';
import Layout from './components/Layout';
import AppProvider from './hooks';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <AppProvider>
          <Routes />
        </AppProvider>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
