import React, { createContext, useCallback, useContext, useState } from 'react';
import Loader from '../components/Loader';

interface LoaderContextData {
  showLoader(): void;
  hideLoader(): void;
}

const LoaderContext = createContext<LoaderContextData>({} as LoaderContextData);

const LoaderProvider: React.FC = ({ children }) => {
  const [show, setShow] = useState(false);

  const showLoader = useCallback(() => {
    setShow(true);
  }, []);

  const hideLoader = useCallback(() => {
    setShow(false);
  }, []);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      {show && <Loader />}
    </LoaderContext.Provider>
  );
};

function useLoader(): LoaderContextData {
  const context = useContext(LoaderContext);

  if (!context) {
    throw new Error('useLoader must be within a LoaderProvider');
  }

  return context;
}

export { LoaderProvider, useLoader };
