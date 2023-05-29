// import { useHistory } from "react-router-dom";
// import '../assets/stylesheets/home.css'

// function Features({ img, title, description }) {
//   const history = useHistory();
//   return (
//     <div className=" col-lg-3 col-md-6">
      
//         <div 
//         className="card feature-card" 
//         style={{ height: "440px"}} 
//         >
//             <img
//               src={img}
//               className="card-img-top feature-image"
//               alt={title}
//               width="276px"
//               height="276px"
//             />
//           <div className="card-body feature-content">
//             <h3>{title}</h3>
//             <p className="card-text">{description}</p>
//           </div>
//         </div>
   
//     </div>
//   )
// }

// export default Features

import { useHistory } from "react-router-dom";
import '../assets/stylesheets/home.css';
import featureData from "../components/FeatureData";
import { FeatureContext } from "../App";
import { useContext } from "react";

function Features() {
  const history = useHistory();
  const [filterType, setFilterType] = useContext(FeatureContext)

  return (
    featureData.map((data) => (
      <div className=" col-xl-3 col-lg-6 col-md-6" key={data.id}>
      
      <div 
      className="card feature-card" 
      style={{ minHeight: "440px"}} 
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

export default Features




