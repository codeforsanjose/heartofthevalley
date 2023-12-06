import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './assets/stylesheets/App.css'
import About from './pages/About'
import Contact from './pages/Contact'
import Footer from './components/Footer'
import Header from './components/Header'
import Home from './pages/Home'
import Search from './pages/Search'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/search" element={<Search />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
