import React from 'react'
import '../assets/stylesheets/featureCard.css'
import ArtDetails from './ArtDetails'
import { useHistory } from "react-router-dom";

function FeatureCard({imgAddr,title, description, address, artist, facility, artType,latLong}) {
   
  const history = useHistory()
  console.log(latLong)
  return (

    <div className="featureCard" style={{
      backgroundImage: `linear-gradient(to top,  rgba(0,0,0,0.6) ,rgba(255,255,255,0.1)),url(${imgAddr})`,
      backgroundSize:"cover",
      backgroundRepeat: "no-repeat", 
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
        <div className='box'>
        <h5 className="title">{title}</h5>
        </div>
      
    </div>
    
  )
}

export default FeatureCard