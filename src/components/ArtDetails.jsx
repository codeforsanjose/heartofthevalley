import React from 'react'
import { useLocation } from 'react-router-dom';
import '../assets/stylesheets/artDetails.css'

function ArtDetails() {
    const location = useLocation();
    console.log(location.state)
    const {artist,title,description,address,facility, imgAddr, artType, latLong} = location.state
    return (  
        <div className="artDetailsPage container mt-4">
            <div className="imageSection ">
                <a className="text-dark" href="/search"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                </svg>Back to search results</a>
                <div className="titleSection d-flex justify-content-between my-5">
                    <h4>{title}</h4>
                    <div classNmae="flagSection"><button><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-flag" viewBox="0 0 16 16">
                        <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001M14 1.221c-.22.078-.48.167-.766.255-.81.252-1.872.523-2.734.523-.886 0-1.592-.286-2.203-.534l-.008-.003C7.662 1.21 7.139 1 6.5 1c-.669 0-1.606.229-2.415.478A21.294 21.294 0 0 0 3 1.845v6.433c.22-.078.48-.167.766-.255C4.576 7.77 5.638 7.5 6.5 7.5c.847 0 1.548.28 2.158.525l.028.01C9.32 8.29 9.86 8.5 10.5 8.5c.668 0 1.606-.229 2.415-.478A21.317 21.317 0 0 0 14 7.655V1.222z"/>
                        </svg></button> Flag</div>
                </div>
                
            </div>
            <div className="detailsSection d-flex justity-content-between my-5">
                <div className="locationSection mr-4">
                <img className="img w-100" style={{height:"55vh", borderRadius:"25px", marginBottom: "1vh"}}src={imgAddr} alt="Image address"/>
                    <p>WHERE</p>
                    <p>{facility}</p>
                
                    <p>HOW TO GET THERE</p>
                    <p>{address}</p>
                    <button className="directions btn btn-rounded px-4 py-2" style={{backgroundColor:"#0F4C64", color:"white",borderRadius:"20px"}}  onClick={()=>{console.log('coming here'),window.location.replace(`https://www.google.com/maps/search/?api=1&query=${latLong[1]}%2C${latLong[0]}`);}}>Get Directions</button> 
               </div>
                <div className="descriptionSection ">
                    <p>CATEGORY</p>
                    <p>{artType}</p>
                    <p>ARTIST</p>
                    <p>{artist}</p>
                    <p>DESCRIPTION</p>
                    <p>{description}</p>
                    <p>PARTNERSHIP</p>
                    <p>City of San Jose</p>
                    <p>SOURCE</p>
                    <a href="#">City of San Jose</a>
                </div>
            </div>
        </div>
  )
}

export default ArtDetails