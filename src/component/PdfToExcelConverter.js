import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { pdfjs } from 'react-pdf';
import * as XLSX from 'xlsx';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PdfToExcelConverter() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [textDate, settextDate] = useState('dfgdfg')

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const convertPDFToExcel = async () => {
    if (!selectedFile) {
      alert('Please select a PDF file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async function (e) {
      const pdfData = new Uint8Array(e.target.result);

      try {
        const loadingTask = pdfjs.getDocument(pdfData);
        const pdf = await loadingTask.promise;
        const extractedData = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          textContent.items.splice(0,7)
          textContent.items.pop()
          
          const text = textContent.items.map((item) => {
            if(item.str.match(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/)){
                return item.str+'\n'+'breack'   
            }
            return item.str
          }).join('\n');
          
          
          let textArray = text.split('\nbreack')
          
          
          settextDate(textArray[0])
         let arrayObj = textArray.map(text=>{
            
            let newtextAr = text.split('\n')
            const noEmptyStrings = newtextAr.filter((str) => str !== '');
            
            let obj = {}
            obj.name = noEmptyStrings[0]
            obj.designation = noEmptyStrings[1]
            obj.address = noEmptyStrings.slice(2,noEmptyStrings.length-1).join(', ')
            obj.phone = noEmptyStrings[noEmptyStrings.length-1]
            return obj
          })
          console.log('arrayObj: ', arrayObj);
          extractedData.push(...arrayObj)
        }

        console.log('extractedData: ', extractedData);
        convertToExcel(extractedData)
        // const worksheet = XLSX.utils.aoa_to_sheet(extractedData);
        
        // const workbook = XLSX.utils.book_new();
        
        // XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

        // const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
        // const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        // // saveAs(excelBlob, 'output.xlsx');
      } catch (error) {
        
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };


  let convertToExcel = (array)=> {
    const worksheet = XLSX.utils.json_to_sheet(array);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    // Create a Blob object from the Excel buffer
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
    // Create a temporary anchor element and download the file
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.xlsx';
    a.click();
  
    // Cleanup
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={convertPDFToExcel}>Convert</button>
    <br />
      <textarea id="w3review" name="w3review" rows="4" cols="50" value={textDate}>
     
</textarea>
    </div>
  );
}

export default PdfToExcelConverter;
