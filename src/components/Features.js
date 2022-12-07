import '../assets/stylesheets/home.css'

function Features(props) {
  return (
    <div className=" col-lg-3 col-md-6">
      <div className="card feature-card" style={{ height: "440px"}}>
        <img
          src={props.img}
          className="card-img-top feature-image"
          alt={props.title}
          width="276px"
          height="276px"
        />
        <div className="card-body feature-content">
          <h3>{props.title}</h3>
          <p className="card-text">{props.description}</p>
        </div>
      </div>
    </div>
  )
}

export default Features
