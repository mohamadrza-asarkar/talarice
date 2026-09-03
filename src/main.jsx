import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context';
import { ErrorBoundary } from './components/ErrorBoundary';
import App from './App.jsx';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <AppProvider>
            <App />
          </AppProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

