import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import CartProvider from './components/context/CartContext.jsx'
import { ensureAdmin } from './admin/adminStore.js'

// بنتأكد إن في حساب أدمن متسجل في الـ localStorage أول ما التطبيق يشتغل (لو مش موجود بيتعمل)
ensureAdmin()

// بنشغّل التطبيق: الراوتر + الـ CartProvider (بتاع السلة والمفضلة) حوالين الـ App
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename='/'>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
