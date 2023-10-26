import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from './App';

const container = document.querySelector('#app')!;

const FullApp = () => (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

if (import.meta.hot || !(container && 'innerText' in container)) {
  const root = createRoot(container);
  root.render(<FullApp />);
} else {
  hydrateRoot(container, <FullApp />);
}
