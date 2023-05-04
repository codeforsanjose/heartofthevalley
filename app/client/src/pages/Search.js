import '../assets/stylesheets/search.css'
import Mapbox from '../components/Mapbox'
import { BsGrid3X3 } from 'react-icons/bs'
import { BsListUl } from 'react-icons/bs'
import { BsMapFill } from 'react-icons/bs'
import SearchGrid from './SearchGrid'
import SearchList from './SearchList'
import axios from "axios";
import { useState, useEffect } from 'react'
import { useHistory, useLocation } from "react-router-dom"
import Features from '../components/Features'


function Search() {

  const [ displayType, setDisplayType ] = useState('grid')



  const history = useHistory();
  const location = useLocation();
  const [ filterType, setFilterType ] = useState('All');

  useEffect(() => {
    if (location.state && location.state.setFilterType) {
      setFilterType(location.state.setFilterType);
    }
  }, [location.state]);

  const handleClick = (newFilterType) => {
    if (newFilterType !== filterType) {
      setFilterType(newFilterType);
      history.push({
        pathname: "/search",
        state: { setFilterType: newFilterType }
      });
    }
  };


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
  
    return { artData: artData || [] , error, loaded };
  };
 
  const {artData,error,loaded} = ArtData('http://localhost:3001/v1/heartofvalley/features')
  
  let displayArtData = Object.assign({},artData)
  filterType !== 'All' ? displayArtData = Object.assign({},artData.filter(data => data['Art Type']=== filterType)): displayArtData = Object.assign({},artData)
 
  console.log(displayArtData, loaded)


  return (
    <div>
      <div className="search-body">
        <div className="container-fluid">
          <div className="search-header">
            <h1>Search Our Collection</h1>
            <input
              type="text"
              className="search"
              placeholder="Search by art,artist or zipcode"
            ></input>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="search-category mt-4">
          <div className="d-flex justify-content-between mr-3 search-name">
          <button type="button" href="#" className="btn btn-light btn-rounded border mr-1 " onClick={()=>{handleClick('All')}}>All</button>
          <button type="button" href="#" className="btn btn-light btn-rounded border mr-1" onClick={()=>{handleClick('Mural')}}>Mural</button>
          <button type="button" href="#" className="btn btn-light btn-rounded border mr-1" onClick={()=>{handleClick('Interactive')}}>Interactive</button>
          <button type="button" href="#" className="btn btn-light btn-rounded border mr-1" onClick={()=>{handleClick('Architecture')}}>Architecture</button>
          <button type="button" href="#" className="btn btn-light btn-rounded border mr-1" onClick={()=>{handleClick('Sculpture')}}>Sculpture</button>
          <button type="button" href="#" className="btn btn-light btn-rounded border mr-1" onClick={()=>{handleClick('Painting')}}>Painting</button>
          <button type="button" href="#" className="btn btn-light btn-rounded border mr-1" onClick={()=>{handleClick('Photography')}}>Photography</button>
          </div>
          <div className="result-views">
          <button type="button" class="btn" onClick={()=>{setDisplayType('grid')}}><BsGrid3X3 className="result-icons"/></button>
          <button type="button" class="btn" onClick={()=>{setDisplayType('list')}}><BsListUl className="result-icons"/></button>
          <button type="button" class="btn" onClick={()=>{setDisplayType('map')}}><BsMapFill className="result-icons"/></button>
          </div>
        </div>
        <div>
          {( loaded === true )? ((displayType === 'grid')? <SearchGrid artData={displayArtData}/>: (displayType === 'list')? <SearchList artData={displayArtData}/>: <Mapbox/>):<h4>Loading data</h4>}
        </div>
          
      </div>
    </div>
  )
}

export default Search
