import React, { useContext } from "react"
import { useNavigate } from "react-router-dom";
import featureData from "./FeatureData";
import { FeatureContext } from "../contexts/FeatureContext";

import '../assets/stylesheets/home.css';

function Features() {
  const history = useNavigate();
  const [filterType, setFilterType] = useContext(FeatureContext)

  return (
    featureData.map((data) => (
      <div className=" col-xl-3 col-lg-6 col-md-6" key={data.id}>

        <div
          className="card feature-card"
          style={{ minHeight: "440px" }}
          onClick={() => {
            history.push({
              pathname: "/search",
            }),
              setFilterType(data.title)
          }}
        >
          <img
            src={data.img}
            className="card-img-top feature-image"
            alt={data.title}
            width="276px"
            height="276px"
          />
          <div className="card-body feature-content">
            <h3>{data.title}</h3>
            <p className="card-text">{data.content}</p>
          </div>
        </div>

      </div>
    ))
  )
}

// Features.propTypes = {
//   img: PropTypes.node.isRequired,
//   title: PropTypes.string.isRequired,
//   description: PropTypes.string.isRequired,
// }

export default Features




