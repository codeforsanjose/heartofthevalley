import React from 'react'
import '../assets/stylesheets/featureCard.css'
import { useHistory } from "react-router-dom";

function FeatureCard({imgAddr,title, description, address, artist, facility, artType,latLong}) {
   
  const history = useHistory()

  return (
    
    <div className="featureCard" style={{ 
      marginBottom: "40px", 
      borderRadius:'25px'}} onClick={()=>{history.push("/artDetails",{
          facility:facility,
          artist: artist,
          address: address,
          description:description,
          imgAddr: imgAddr, 
          title: title,
          artType: artType,
          latLong: latLong
      })}}>
        <img className='imgSrc' src={imgAddr} alt="Image unavailable" />
        <div className=''>
   
          <h5 className="art-title">{title}</h5>
        
        </div>
      
    </div>
    
  )
}

export default FeatureCard