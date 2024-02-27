import React, { createContext, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'
import About from './pages/About'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Search from './pages/Search'

import './assets/stylesheets/App.css'
//<<<<<<< HEAD
export const FeatureContext = createContext()
export const SearchContext = createContext()

const App = () => {
  const [searchText, setSearchText] = useState('')
  const [filterType, setFilterType] = useState('All')
  return(
  <FeatureContext.Provider value={[filterType, setFilterType]}>
    <SearchContext.Provider value={[searchText,setSearchText]}>
      
  <div id="appRoot">
    <div className="appContent">
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
  </div>
   </SearchContext.Provider>
  </FeatureContext.Provider>
)}

export default App
