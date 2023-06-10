import React from 'react'
import './assets/stylesheets/App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Search from './pages/Search'
import ArtDetails from './components/ArtDetails'
import { createContext, useState } from 'react'

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
      <Header />
  
      <Switch>
        <Route path="/about">
          <About />
        </Route>
  
        <Route path="/contact">
          <Contact />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        <Route path="/artDetails">
          <ArtDetails/>
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
  
      <Footer />
    </div>
  </div>
   </SearchContext.Provider>
  </FeatureContext.Provider>
)}

export default App
