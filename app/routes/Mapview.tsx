// eslint-disable-next-line import/no-named-as-default
import Map from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';


function Mapview() {

  return (
        <Map
         mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
         initialViewState={{
          longitude: 7.628202,
          latitude: 51.961563,
          zoom: 2,
          }}
        style={{width: "100vw", height: "100vh"}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        projection={{ name: "globe" }}
     />

  )
}

export default Mapview
