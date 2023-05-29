import './App.css';
import { useState } from 'react';
import PdfToExcelConverter from './component/PdfToExcelConverter';

function App() {
  const [file, setFile] = useState(null);

  const handleFileSelect = (selectedFile) => {
    console.log("selectedFile",selectedFile)
    setFile(selectedFile);
  };
  return (
    <div className="App">
      <PdfToExcelConverter />
      
    </div>
  );
}

export default App;
