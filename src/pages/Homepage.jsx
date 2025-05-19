import React from 'react'
import styles from './Homepage.module.css'
import {useState} from 'react'


export default function Homepage() {

  const [selectedFile, setSelectedFile] = useState(null);
  const [classificationResults, setClassificationResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log(event.target.files)
    setSelectedFile(file);
    setError(null); // Clear previous errors

    // Create a preview URL for the image
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first.');
      return;
    }

    setLoading(true);
    setError(null);
    setClassificationResults(null);

    const formData = new FormData();
    formData.append('image', selectedFile); // 'image' must match the Multer field name on backend

    try {
      //Dynamic API base URL from Env. variables
      const BASE_API_URL = import.meta.env.VITE_API_URL;
      
      //check base api working
       if (!BASE_API_URL) {
      console.error("VITE_API_URL is not defined. Please check your environment variables.");
      // Handle this error appropriately, e.g., show an error message to the user
      return;
      }

      // IMPORTANT: Ensure this URL matches your backend server's address and port
      const response = await fetch(`${BASE_API_URL}/api/classify-image`, {
        method: 'POST',
        body: formData, // fetch will automatically set Content-Type to multipart/form-data
      });

      if (!response.ok) {
        // Handle HTTP errors (e.g., 400, 500 from your backend)
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong on the server.');
      }

      const data = await response.json();
      setClassificationResults(data.results); // Assuming your backend sends { message, results }
      console.log(data);
    } catch (err) {
      console.error('Error during upload or classification:', err);
      setError(err.message || 'Failed to classify image. Please try again.');
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="App">
      <h1>Image Classifier</h1>

      <div className="input-section">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!selectedFile || loading}>
          {loading ? 'Classifying...' : 'Classify Image'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {previewImage && (
        <div className="image-preview">
          <h2>Selected Image:</h2>
          <img src={previewImage} alt="Preview" style={{ maxWidth: '300px', maxHeight: '300px', border: '1px solid #ccc' }} />
        </div>
      )}

      {classificationResults && (
        <div className="results-section">
          <h2>Classification Results:</h2>
          {/* Adapt this rendering based on the actual structure of your Custom Vision API response */}
          {/* For Classification, it typically has a 'predictions' array. */}
          {classificationResults.predictions && classificationResults.predictions.length > 0 ? (
            <div>
              Your Vehicle appears to be a : {classificationResults.predictions[0].tagName}
            </div>
          ) : (
            <p>No predictions found or unexpected response format.</p>
          )}
          {/* You might also want to display other details from the response for debugging */}
          {/* <pre>{JSON.stringify(classificationResults, null, 2)}</pre> */}
        </div>
      )}
    </div>
  );
}
