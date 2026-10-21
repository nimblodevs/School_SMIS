import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from './App.jsx';
import { AuthToastListener } from './components/Auth/AuthToastListener.jsx';
import './index.css';
import { AuthBootstrap } from './lib/AuthBootstrap.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthBootstrap>
        <App />
      </AuthBootstrap>
      <AuthToastListener />
      <Toaster position="top-center" richColors closeButton />
    </BrowserRouter>
  </StrictMode>,
);
