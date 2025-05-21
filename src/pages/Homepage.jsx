import React from 'react'
import styles from './Homepage.module.css'
import {useState} from 'react'
import turnersHeader from '../assets/turners-header.png'
import turnersCarousel from '../assets/carousel.png'
import turnersMid from '../assets/mid.png'
import turnersFooter from '../assets/turners-footer.png'


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
    setError(null); // Clear any previous errors

    // Create preview URL for image selected by user
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
    formData.append('image', selectedFile); // 'image' to match Multer field name on backend

    try {
      //Dynamic API base URL from Env. variables
      const BASE_API_URL = import.meta.env.VITE_API_URL;
      
      //check base api working
       if (!BASE_API_URL) {
      console.error("VITE_API_URL is not defined. Please check your environment variables.");
      
      return;
      }

      // Ensuring this URL matches your backend server's address and port and used dynamic API base
      const response = await fetch(`${BASE_API_URL}/api/classify-image`, {
        method: 'POST',
        body: formData, // fetch to automatically set Content-Type to multipart/form-data
      });

      if (!response.ok) {
        // Handle HTTP errors 
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong on the server.');
      }

      const data = await response.json();
      setClassificationResults(data.results); // Backend sends { message, results }
      console.log(data);
    } catch (err) {
      console.error('Error during upload or classification:', err);
      setError(err.message || 'Failed to classify image. Please try again.');
    } finally {
      setLoading(false);
    }
  };




  return (
    <>
    <main className={styles.mainPageContainer}>


    <header className={styles.header}>
      <img src={turnersHeader} alt="Turners page Header" />
    </header>

    <section className={styles.carouselSection}>
      <img src={turnersCarousel} alt="Turners carousel" />
    </section>

    <section className={styles.midSection}>
      <img src={turnersMid} alt="Turners mid section" />
    </section>

    <div className={styles.app}>
      <p className={styles.appTitle}>Upload an Image of your Car</p>
      <p className={styles.appInstructions}>Upload an image of your car, find out the car type, and apply for a quote today.</p>

      <div className={styles.appBox}>
        <div className={styles.inputSection}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button onClick={handleUpload} disabled={!selectedFile || loading}>
            {loading ? 'Classifying...' : 'Classify Image'}
          </button>
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        {previewImage && (
          <div className={styles.imagePreview}>
            <p className={styles.appTitle}>Selected Image:</p>
            <img src={previewImage} alt="Preview" style={{ maxWidth: '300px', maxHeight: '300px', border: '1px solid #ccc' }} />
          </div>
        )}

        {classificationResults && (
          <div className={styles.resultsSection}>
            <p className={styles.appTitle}>Classification Results:</p>
          
            {classificationResults.predictions && classificationResults.predictions.length > 0 ? (
              <div>
                Your Vehicle appears to be a {classificationResults.predictions[0].tagName}. Go ahead and apply for a quote <a href='https://www.turners.co.nz/Cars/finance-insurance/car-insurance/motor-vehicle-insurance-faqs/'>here</a>
              </div>
            ) : (
              <p>No predictions found or unexpected response format.</p>
            )}
          </div>
        )}
      </div>

    </div>

    <footer className={styles.footerSection}>
      <img src={turnersFooter} alt="Turners Footer" />
    </footer>

    </main>
    </>
  );
}
