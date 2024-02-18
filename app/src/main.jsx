import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Contexts
import { SecretjsContextProvider } from './secretJs/SecretjsContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SecretjsContextProvider>
      <App />
    </SecretjsContextProvider>
  </React.StrictMode>,
)
