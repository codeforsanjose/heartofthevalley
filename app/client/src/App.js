import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './assets/stylesheets/App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter, Route } from "react-router-dom"
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Footer from './components/Footer'
import Header from './components/Header'
import Home from './pages/Home'
import Search from './pages/Search'
import ArtDetails from './components/ArtDetails'
import { createContext, useState } from 'react'

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
// =======
// function App() {
//   return (
//     <div>
//       <BrowserRouter>
//         <Header />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/contact" element={<Contact />} />
//           <Route path="/search" element={<Search />} />
//         </Routes>
//         <Footer />
//       </BrowserRouter>
//     </div>
//   )
// }
// >>>>>>> 4c9154ef3b7d5d6def6765867814061cd94ab2d8

export default App
