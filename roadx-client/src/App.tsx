import React from 'react';
import './App.css';
import UploadFile from './components/Uploader';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
      <UploadFile />
      </header>
    </div>
  );
}

export default App;
