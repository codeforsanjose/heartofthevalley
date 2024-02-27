import React from 'react'
import '../assets/stylesheets/featureList.css'
import { useNavigate } from "react-router-dom";

function FeatureList({ imgAddr, title, description, address, artist, facility, artType }) {

  const history = useNavigate()
  return (
    <div style={{ borderRadius: "30px" }} className='conatainer d-flex flex-row m-3 bg-light w-90 featureListContainer'
      onClick={() => {
        history.push("/artDetails", {
          facility: facility,
          artist: artist,
          address: address,
          description: description,
          imgAddr: imgAddr,
          title: title,
          artType: artType
        })
      }}>
      {/* <div  className=""> 
            <img className="imgSize" src={imgAddr}  alt="Mural image"/>
            <p  style={{position:"relative", top: "-70px", left:"15px", fontSize:"22px" }} className="text-white text-capitalize font-weight-bold">{title}</p>
        </div> */}
      <div className="imgSize" style={{
        backgroundImage: `linear-gradient(to bottom,  rgba(0,0,0,0.6) ,rgba(255,255,255,0)),url(${imgAddr})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        marginBottom: "40px",
        borderRadius: '25px'
      }}
      >
        <h5 className="title">{title}</h5>
      </div>
      <div id="module" className="container m-2 p-2">
        <p className="collapse" id="collapseExample" aria-expanded="false">
          {description}
        </p>
        <p className="artist" id="" >
          {artist}
        </p>
        {/* <a role="button" class="collapsed" data-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample"></a> */}
      </div>
    </div>
  )
}

export default FeatureList