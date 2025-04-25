import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import RoutingModule from './routes/RoutingModule';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <RoutingModule />
    </BrowserRouter>
  );
};

export default App;
