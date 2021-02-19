import React from 'react';

import { LoaderProvider } from './loader';
import { ToastProvider } from './toast';

const AppProvider: React.FC = ({ children }) => (
  <ToastProvider>
    <LoaderProvider>{children}</LoaderProvider>
  </ToastProvider>
);

export default AppProvider;
