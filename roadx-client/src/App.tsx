import React from "react";
import './App.css';
//import Uploader from './components/Uploader';
import Map from './components/map';
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const App: React.FC = () => {
  return (
   <div className="App">
     <Map />
   </div>
  );
}

export default App;
