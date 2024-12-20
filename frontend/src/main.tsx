import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext.tsx';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')!).render(
  <>
    <BrowserRouter>
      <AuthProvider>
        <CssBaseline />
        <App />
        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  </>,
);
