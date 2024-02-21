import React, { useState } from 'react';
import { db } from '../../firebase'; // Assuming the path to your Firebase initialization file
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const UploadCSVToFirestore = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const rows = text.split('\n').map(row => row.split(','));

      // Assuming the headers are "Denumire", "Cod", "Created", and "Pret"
      const headers = rows[0];

      // Remove the first row (headers) from the data
      rows.shift();

      // Convert rows to objects
      const data = rows.map(row => {
        const obj = {};
        obj[headers[0]] = row[0]; // Assuming the first column is "Denumire"
        obj[headers[1]] = row[1] ? row[1].replace(/\s+$/, '') : ''; // Trim trailing whitespace from "Cod"
        obj[headers[2]] = row[2] ? row[2].replace(/\s+$/, '') : ''; // "Created" column
        obj[headers[3]] = row[3] ? row[3].replace(/\s+$/, '') : ''; // "Pret" column
        return obj;
      });

      // Upload data to Firestore
      try {
        for (const doc of data) {
          await addDoc(collection(db, "produse"), { ...doc, Created: Date.now() }); // Adding Created timestamp
        }
        console.log('Data uploaded successfully!');
      } catch (error) {
        console.error('Error uploading data:', error);
        setUploadError(error.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {uploadProgress > 0 && <p>Upload Progress: {uploadProgress.toFixed(2)}%</p>}
      {uploadError && <p>Error: {uploadError}</p>}
    </div>
  );
};

export default UploadCSVToFirestore;
