import React from "react";
import './App.css';
import Uploader from './components/uploadPortal/Uploader';
import Map from './components/Map';
import PlatformApp from './components/PlatformApp';

const App: React.FC = () => {
  return (
   <div className="App">
     <PlatformApp/>
   </div>
  );
}

export default App;
