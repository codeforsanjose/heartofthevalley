import '../assets/stylesheets/search.css'
import Mapbox from '../components/Mapbox'
import { BsGrid3X3 } from 'react-icons/bs'
import { BsListUl } from 'react-icons/bs'
import { BsMapFill } from 'react-icons/bs'
import SearchGrid from './SearchGrid'
import SearchList from './SearchList'
import axios from "axios";
import { useState, useEffect,useContext } from 'react'
import { SearchContext, FeatureContext } from '../App'



function Search() {

  const [ displayType, setDisplayType ] = useState('grid')
  const [ filterType, setFilterType ] = useContext(FeatureContext)
  const [ searchText, setSearchText ] = useContext(SearchContext)

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
  artData != null && filterType !== 'All' ? displayArtData = Object.assign({},artData.filter(data => data['Art Type']=== filterType)): displayArtData = Object.assign({},artData)
  let searchArtData = Object.assign({},artData)
   if(searchText != '' && artData != null){
  searchArtData = Object.assign({},artData.filter((data)=> data['Postal Code']=== searchText || (data['Title']).toLowerCase() === (searchText).toLowerCase() ))
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
              onChange={(e)=>{setSearchText(e.target.value)}} 
              placeholder="Search by art or zipcode"
            ></input>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="search-category mt-4">
          <div className="d-flex justify-content-between mr-3 search-name">
          <button type="button" href="#" className="btn btn-light btn-rounded border mr-1 " onClick={()=>{setFilterType('All'),setSearchText('')}}>All</button>
          <button type="button" href="#" className="btn btn-light btn-rounded border mr-1" onClick={()=>{setFilterType('Mural'),setSearchText('')}}>Mural</button>
          <button type="button" href="#" className="btn btn-light btn-rounded border mr-1" onClick={()=>{setFilterType('Interactive'),setSearchText('')}}>Interactive</button>
          <button type="button" href="#" className="btn btn-light btn-rounded border mr-1" onClick={()=>{setFilterType('Architechture'),setSearchText('')}}>Architecture</button>
          <button type="button" href="#" className="btn btn-light btn-rounded border mr-1" onClick={()=>{setFilterType('Sculpture'),setSearchText('')}}>Sculpture</button>
          <button type="button" href="#" className="btn btn-light btn-rounded border mr-1" onClick={()=>{setFilterType('Painting'),setSearchText('')}}>Painting</button>
          <button type="button" href="#" className="btn btn-light btn-rounded border mr-1" onClick={()=>{setFilterType('Photography'),setSearchText('')}}>Photography</button>
          </div>
          <div className="result-views">
          <button type="button" class="btn" onClick={()=>{setDisplayType('grid')}}><BsGrid3X3 className="result-icons"/></button>
          <button type="button" class="btn" onClick={()=>{setDisplayType('list')}}><BsListUl className="result-icons"/></button>
          <button type="button" class="btn" onClick={()=>{setDisplayType('map')}}><BsMapFill className="result-icons"/></button>
          </div>
        </div>
        <div>
          {( loaded === true )? ((displayType === 'grid')? ((searchText != '')?<SearchGrid artData={searchArtData}/>:<SearchGrid artData={displayArtData}/>): (displayType === 'list')?((searchText!='')?<SearchList artData={searchArtData}/>:<SearchList artData={displayArtData}/>) : <Mapbox/>):<h4>Loading data</h4>}
        </div>
          
      </div>
    </div>
  )
}

export default Search
