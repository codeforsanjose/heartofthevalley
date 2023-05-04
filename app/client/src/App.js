import React from 'react'
import './assets/stylesheets/App.css'
import Header from './components/Header'
import Footer from './components/Footer'
// import { Route, Switch } from 'react-router-dom'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Search from './pages/Search'
import ArtDetails from './components/ArtDetails'


const App = () => (
    <div>
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
)

export default App
