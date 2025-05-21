<a id="readme-top"></a>

# Mission Ready Level 5 FT 2025: Mission 1 - Turners Car Project  
<br/>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#turners-car-insurance-project---cloud-base-app-to-identify-vehicle-types">Turners Car Insurance Project</a>
     </li>  
    <li><a href="#built-with">Built With</a></li>
    <li>
      <a href="#first-git-actions">Getting Started</a>
    </li>
    <li><a href="#front-end-structure">Front-end Structure</a></li>
    <li><a href="#back-end-structure">Back-end Structure</a></li>
  </ol>
</details>

## Turners Car Insurance Project - Cloud Base App. to identify vehicle 'types'

This project was completed for 'Mission 1', as part of the Mission Ready 2025 FT Course. 

The brief:

Turners is re-designing its motor vehicle insurances systems, and investigating ways to introduce new technologies. 

Turners Digital Team want a prototype that:
-	Allows user to upload picture of a car
-	Identifies the type of vehicle 

Tasks:
-	Build a cloud-based application that can recognise motor vehicle types (e.g. sedan vs SUV vs truck)
-	Use a cloud-based AI service MS Azure, AWS, or Google Cloud

Microsoft Azure services were selected to build an image classification model. The final project consists of 3 components:
- MS Azure Image Classification Model
- 'front-end' Prototype Showcase (Hosted on MS Azure Cloud Services)
- 'back-end' Node.js Server, receiving images from front-end and 'Posting' to Image Classification Model for front-end response (Hosted on MS Azure Cloud Services)

This README file is included in the front-end repo, but also covers backend features. For reference repo. locations are:
- front-end; https://github.com/AdamT-HJ/MR-Lvl5-2025-Mission-1-FRONTEND
- back-end; https://github.com/AdamT-HJ/MR-Lvl5-2025-Mission-1-BACKEND

Image Classification Model hosted on MS Azure - will be taken 'Unpublished' post project.


### Built With

* [![React][React.js]][React-url]


<p align="right">(<a href="#readme-top">back to top</a>)</p>



# First Git Actions
- After cloning and pulling the base project change to the project directory in your terminal and run "npm install" to install the required packages:

    `npm install`


- Following that, "npm run dev"  will run the app in development mode:

    `npm run dev`


## Front-end Structure
The 'front-end' features a basic 'Homepage' of Turners Car Insurance to act as a showcase for the prototype image classification model.


### Image Upload ( input type = file & URL.createObjectURL ) 
User image upload is provided for through use of input type = file. This allows for an image preview through use of URL.createObjectURL(), and for image to be sent to Azure Classification Model via 'back-end' without use of a database or image upload/hosting service.



```
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
```

```
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
```

## ENV Variables
Env. variables are used in the front-end to provide a 'dynamic' base api `VITE_API_URL` 

This allows for a different 'base' API endpoint depending on whether the project is being run locally in the 'dev' environment or in 'build' in cloud services. This can be seen in the fetch request structure:
```
const response = await fetch(`${BASE_API_URL}/api/classify-image`, {
```
In the 'build' cloud environment `VITE_API_URL` is configured to the cloud hosted backend URL. 

## Back-end Structure
The back-end of the project receives the fetch request and user provided car image. 'Multer' middleware handles the multi-part form data. Use of cors configuration allows for back-end code to work in 'dev' and 'build' environment.

### Multer
Multer middleware handles multipart/form-data, and temp. storage of the image in server RAM before POST to Azure Image Classification model for classification.

```
//Multer Configuration
//Images to be stored temp. in RAM
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});
```

```
//POST request to Azure Custom Vision API
        const azureResponse = await axios.post(
            AZURE_CUSTOM_VISION_ENDPOINT, 
            imageBuffer,
            {
                headers: {
                    'Content-Type': 'application/octet-stream', 
                    'Prediction-Key': AZURE_CUSTOM_VISION_KEY 
                },
                maxBodyLength: Infinity, 
                maxContentLength: Infinity
            }
        );

        // Azure results back to frontend
        res.status(200).json({
            message: 'Image classified successfully!',
            results: azureResponse.data // containing the 'predictions' array etc.
        });
```

### Cors
Cors setup allows for for back-end code to work in 'dev' and 'build' environment, as will receive requests from local origin or front-end cloud.

```
// Middlewares
const allowedOrigins = [
   'http://localhost:5173', 
   'https://icy-coast-08361f410.6.azurestaticapps.net'
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

```


### Env Variables
Env variables used in the back-end provide for access to MS Azure Classification Model.


<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/


