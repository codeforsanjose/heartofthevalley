import React, { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'
import About from './pages/About'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Search from './pages/Search'
import { FeatureContext } from './contexts/FeatureContext'
import { SearchContext } from './contexts/SearchContext'

import './assets/stylesheets/App.css'

function App() {
  const [searchText, setSearchText] = useState('')
  const [filterType, setFilterType] = useState('All')
  const featureContextValue = React.useMemo(() => {
    return [filterType, setFilterType]
  }, [filterType])
  const searchContextValue = React.useMemo(() => {
    return [searchText, setFilterType]
  }, [searchText])
  return (
    <FeatureContext.Provider value={featureContextValue}>
      <SearchContext.Provider value={searchContextValue}>

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
  )
}

export default App
