import React from 'react'
import ArtData from '../assets/_legacy-art.json'
import FeatureList from '../components/FeatureList'
import { useState, useEffect } from 'react'
import axios from "axios";

function SearchList({artData}) {

  return (
    
    <div className="mt-5 d-flex flex-column">
        
        {Object.entries(artData).map((data, key) => {
                return <FeatureList imgAddr={data[1].imagePath}  title={data[1].Title} description={data[1].Description} artist={data[1].Artist}/>
            })} 
    </div>
  )
}

export default SearchList