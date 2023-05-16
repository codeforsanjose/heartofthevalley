import '../assets/stylesheets/search.css'
import Mapbox from '../components/Mapbox'
import { BsGrid3X3 } from 'react-icons/bs'
import { BsListUl } from 'react-icons/bs'
import { BsMapFill } from 'react-icons/bs'
import SearchGrid from './SearchGrid'
import SearchList from './SearchList'
import axios from "axios";
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';




function Search() {

  const [ displayType, setDisplayType ] = useState('grid')
  const [ filterType, setFilterType ] = useState('All')
  const [ searchText, setSearchText ] = useState('')
  const location = useLocation();
    

  const ArtData = (url) => {
    const [artData, setArtData] = useState(null);
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);
  
    useEffect(() => {
      
      axios
        .get(url)
        .then((response) => setArtData(response.data))
        .catch((error) => setError(error.message))
        .finally(() => setLoaded(true));
    }, []);
  
    return { artData, error, loaded };
  };
   
 
  const {artData,error,loaded} = ArtData('http://localhost:3001/v1/heartofvalley/features')
  
  let displayArtData = Object.assign({},artData)
  filterType !== 'All' ? displayArtData = Object.assign({},artData.filter(data => data['Art Type']=== filterType)): displayArtData = Object.assign({},artData)
  let searchArtData = Object.assign({},artData)
   if(searchText != '' && artData != null){
  searchArtData = Object.assign({},artData.filter((data)=> data['Postal Code']=== searchText || data['Title']=== searchText ))
 } 
 if(artData != null && location.state!= null){
  searchArtData = Object.assign({},artData.filter((data)=> data['Postal Code']=== (location.state.find_art) || data['Title']=== (location.state.find_art) ))
 } 
 

  return (
    <div>
      <div className="search-body">
        <div className="container-fluid">
          <div className="search-header">
            <h1>Search Our Collection</h1>
            <input
              type="text"
              className="search"
              value={searchText}
              /* onChange={(e)=>{setSearchText(e.target.value)}} */
              placeholder="Search by art,artist or zipcode"
            ></input>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="search-category mt-4">
          <div className="d-flex justify-content-between mr-3 search-name">
          <button type="button" href="#" className="btn btn-light btn-rounded border mr-1 " onClick={()=>{setFilterType('All')}}>All</button>
          <button type="button" href="#" className="btn btn-light btn-rounded border mr-1" onClick={()=>{setFilterType('Mural')}}>Mural</button>
          <button type="button" href="#" className="btn btn-light btn-rounded border mr-1" onClick={()=>{setFilterType('Interactive')}}>Interactive</button>
          <button type="button" href="#" className="btn btn-light btn-rounded border mr-1" onClick={()=>{setFilterType('Architechture')}}>Architecture</button>
          <button type="button" href="#" className="btn btn-light btn-rounded border mr-1" onClick={()=>{setFilterType('Sculpture')}}>Sculpture</button>
          <button type="button" href="#" className="btn btn-light btn-rounded border mr-1" onClick={()=>{setFilterType('Painting')}}>Painting</button>
          <button type="button" href="#" className="btn btn-light btn-rounded border mr-1" onClick={()=>{setFilterType('Photography')}}>Photography</button>
          </div>
          <div className="result-views">
          <button type="button" class="btn" onClick={()=>{setDisplayType('grid')}}><BsGrid3X3 className="result-icons"/></button>
          <button type="button" class="btn" onClick={()=>{setDisplayType('list')}}><BsListUl className="result-icons"/></button>
          <button type="button" class="btn" onClick={()=>{setDisplayType('map')}}><BsMapFill className="result-icons"/></button>
          </div>
        </div>
        <div>
          {( loaded === true )? ((displayType === 'grid')? ((searchText != '' || location.state!= null)?<SearchGrid artData={searchArtData}/>:<SearchGrid artData={displayArtData}/>): (displayType === 'list')?((searchText!='' || location.state!= null)?<SearchList artData={searchArtData}/>:<SearchList artData={displayArtData}/>) : <Mapbox/>):<h4>Loading data</h4>}
        </div>
          
      </div>
    </div>
  )
}

export default Search
