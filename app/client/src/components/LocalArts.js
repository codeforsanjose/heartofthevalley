import { useHistory } from "react-router-dom";
import localFavoritesData from "../components/LocalFavoritesData";
import '../assets/stylesheets/localArts.css'

export default function LocalArts() {
  const history = useHistory();

  return (
    <div className="row">
      {localFavoritesData.map((data) => (
        <div className="col-lg-3 col-md-6" key={data.id}>
          <div
            className="card feature-card"
            onClick={() => {
              history.push({
                pathname: "/artDetails",
                state: {
                  facility: data.Facility,
                  artist: data.Artist,
                  address: data.Address,
                  description: data.Description,
                  imgAddr: data.imagePath, 
                  title: data.Title,
                  artType: data.ArtType,
                  latLong: data.latLong
                },
              });
            }}
          >
            
              <img
                src={data.imagePath}
                className="card-img square-img"
                alt={data.Title}
                style={{ borderRadius: "25px" }}
              />
            
            <div className="card-img-overlay ">
              <h3 className="card-title local-title">{data.Title}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}