import React from 'react'
import FeatureCard from '../components/FeatureCard'
import { useState, useEffect } from 'react'
import axios from "axios";


function SearchGrid({artData}) {

  return (
    
     <div className="mt-5 d-flex justify-content-around flex-wrap ">
      {Object.entries(artData).map((data, key) => {
           {console.log(data)} 
                return <FeatureCard imgAddr={data[1].imagePath}  title={data[1].Title} description={data[1].Description} artist={data[1].Artist} address={data[1].Address} facility={data[1].Facility} artType={data[1]["Art Type"]} latLong={data[1].latLong}/>
            })} 
            
    </div>
  )
  }

export default SearchGrid