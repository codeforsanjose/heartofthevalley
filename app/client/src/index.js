import React from 'react'
import { createRoot } from 'react-dom/client';

import "./assets/Fonts/Gotham-Font/Gotham-Black.otf"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'jquery/dist/jquery.min.js'
import App from './App'

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
