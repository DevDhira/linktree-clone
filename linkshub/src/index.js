import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AuthProvider from './context/AuthContext';
import LinksProvider from './context/LinksContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <LinksProvider>
        <App />
      </LinksProvider>
    </AuthProvider>
  </React.StrictMode>
);
