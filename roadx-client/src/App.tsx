import React from 'react';
import './App.css';
import FileUploader from './components/FileUploader';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
      <FileUploader />
      </header>
    </div>
  );
}

export default App;
