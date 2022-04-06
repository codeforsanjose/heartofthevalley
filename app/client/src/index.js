import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'jquery/dist/jquery.min.js'
import { BrowserRouter } from 'react-router-dom'
import "./assets/Fonts/Gotham-Font/Gotham-Black.otf"
import "./assets/Fonts/arial_th/ArialTh.ttf"

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
)
