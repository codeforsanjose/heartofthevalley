import React from 'react'
import Mapbox from '../components/Mapbox'
import '../assets/stylesheets/home.css'

function Home() {
    return (
        <div className="body">
            <div className="herobanner">
                <h1 className="title">Explore Art<br></br> in Sanjose</h1>
            </div>
            <div className="mapbox">
               <Mapbox />
            </div>
            
        </div>
    )
}

export default Home