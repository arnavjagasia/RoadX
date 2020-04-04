# RoadX Server
  
## Testing and Deployment
To run the server locally: `env FLASK_APP=server.py flask run`
This will run on localhost:5000 by default

## API
### `/create` - POST
Saves a zip file of images and associated metadata into MongoDB

Parameters: 
* `imageFile`: (binary) zip file of .png images to save
* `gpsFile`: (binary) csv file with GPS data for the images in `imageFile`
* `deviceId`: Roadx Device Id
* `timestamp`: Image upload time
* `imageBatchUploadId`: unique identifier for the batch of images in `imageFile`
* `gpsUploadId`: unique identifier for the GPS data in `gpsFile` (currently unused)

### `/analyzeImage` - POST
Runs analysis on all images in a batch and then updates the MongoDB documents

Parameters:
* `imageBatchUploadId` - batch ID for the batch of images to analyze
