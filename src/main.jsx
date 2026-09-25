import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { RouterProvider } from './lib/router';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import './styles/index.css';

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Missing #root element — index.html must include <div id="root"></div>.');
}

createRoot(rootEl).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider>
        <AuthProvider>
          <ContentProvider>
            <App />
          </ContentProvider>
        </AuthProvider>
      </RouterProvider>
    </ErrorBoundary>
  </StrictMode>,
);
