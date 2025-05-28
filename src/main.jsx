import { createRoot } from 'react-dom/client'
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)

reportWebVitals();