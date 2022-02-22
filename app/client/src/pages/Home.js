import React from 'react'
import Mapbox from '../components/Mapbox'
import '../assets/stylesheets/home.css'

function Home() {
  return (
    <div className="home">
      <div className="container">
        <div className="herobanner">
          <div className="row">
          <div className="col-lg-6">
          <h1 className="title">
            Explore Art<br></br> in Sanjose
          </h1>
          </div>
          <div className="col-lg-6">
          <div ><a href="#">Browse all </a></div>
          <div> <a href="#">Checkout our new spots <br></br> in the area </a></div>
         
          </div>
          </div>
        </div>
        <div className="mapbox">
          <Mapbox />
        </div>
        <div className="categories">
          <h2>Featured Categories</h2>
          <div className="row">
            <div className="col-lg-3 col-md-2">
              <div className="card">
                <img
                  src="https://images.unsplash.com/photo-1552596828-4e48cd784320?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                  className="card-img-top"
                  alt="..."
                />
                <div className="card-body">
                  <h3>Sculptures</h3>
                  <p className="card-text">
                    Some quick example text to build on the card title and make up the bulk of the
                    card's content.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-2">
              <div className="card">
                <img
                  src="https://images.unsplash.com/photo-1552596828-4e48cd784320?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                  className="card-img-top"
                  alt="..."
                />
                <div className="card-body">
                  <h3>Grafitti</h3>
                  <p className="card-text">
                    Some quick example text to build on the card title and make up the bulk of the
                    card's content.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-2">
              <div className="card">
                <img
                  src="https://images.unsplash.com/photo-1552596828-4e48cd784320?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                  className="card-img-top"
                  alt="..."
                />
                <div className="card-body">
                  <h3>Murals</h3>
                  <p className="card-text">
                    Some quick example text to build on the card title and make up the bulk of the
                    card's content.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-2">
              <div className="card">
                <img
                  src="https://images.unsplash.com/photo-1552596828-4e48cd784320?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                  className="card-img-top"
                  alt="..."
                />
                <div className="card-body">
                  <h3>Architecture</h3>
                  <p className="card-text">
                    Some quick example text to build on the card title and make up the bulk of the
                    card's content.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
