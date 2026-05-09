import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { BakeryProvider } from './context/BakeryContext';
import AppContent from './AppContent';

function App() {
  return (
    <BrowserRouter>
      <BakeryProvider>
        <AppContent />
      </BakeryProvider>
    </BrowserRouter>
  );
}

export default App;
