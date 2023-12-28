import Logbun, { LogbunErrorBoundary } from '@logbun/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

Logbun.init({
  apiKey: 'YOUR_API_KEY',
  endpoint: 'http://localhost:2000/api/log',
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <LogbunErrorBoundary logbun={Logbun}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </LogbunErrorBoundary>
);
