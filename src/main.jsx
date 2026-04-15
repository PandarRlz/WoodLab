import React from 'react'
import ReactDOM from 'react-dom/client'
import App from "./pages/App"
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext' // <--- IMPORTACIÓN NUEVA
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider> {/* <--- ENVOLVEMOS AQUÍ */}
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>,
)