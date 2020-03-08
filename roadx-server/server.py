import os
import json
# import model
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
import gridfs

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/RoadXDatabase"
mongo = PyMongo(app)


### HELPERS
def has_json_body(content_type_string):
    """
    Returns true if the content type is JSON
    """
    return str.startswith(content_type_string, "application/json")

@app.route('/create', methods=['POST'])
def create():
    # Validation
    if request is None or request.method != 'POST':
        return(jsonify({'ok': False, 'message': 'Bad request'}), 401)

    # Extract parameters from request
    data = request.form
    image = request.files['file']

    # Request parameter validation
    hasFile = bool(image is not None)
    hasDeviceId = bool(data.get('deviceId', None) is not None)
    hasTimestamp = bool(data.get('timestamp', None) is not None)
    hasFilename = bool(data.get('filename', None) is not None)
    
    if not hasFile or not hasDeviceId or not hasTimestamp or not hasFilename:
        return(jsonify({'ok': False, 'message': 'Bad request'}), 401)
    
    # Save the actual image in GridFS files
    mongo.save_file(data.get('filename'), image, content_type="image/png")

    # Save filename with the rest of the data
    database_data = {
        'deviceId': data.get('deviceId'),
        'timestamp': data.get('timestamp'),
        'filename': data.get('filename')
    }
    mongo.db.images.insert_one(database_data)

    response = {'ok': True}
    return_code = 200
    return (jsonify(response), return_code)

@app.route('/analyzeImage', methods=['GET'])
def analyzeImage():
    ## Get image by id
    #image  = get from mongo by id

    ## Run model on image
    #image_np, class_and_scores = model.run_model(image)
    ## Save new Data
    ## Return 200
    
    
    response = {'ok': False, 'message': 'Internal Error'}
    return_code = 500
    return (jsonify(response), return_code)