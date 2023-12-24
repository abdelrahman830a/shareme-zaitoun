import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';


ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <React.StrictMode>
    <GoogleOAuthProvider clientId="59855604207-fs7ulr4dpcvf4v1gauiu18ql1hfhegrg.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
    </React.StrictMode>,
  </Router>
)
