import os
import json
import io
from PIL import Image
import numpy as np
import model
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
import png
import tensorflow as tf
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
        'filename_raw': data.get('filename'),
    }
    mongo.db.images.insert_one(database_data)

    response = {'ok': True}
    return_code = 200
    return (jsonify(response), return_code)

def bytes_to_image(binary_data):
    image = Image.open(io.BytesIO(binary_data))
    (im_width, im_height) = image.size
    arr = np.array(image.getdata())[...,:3]
    arr = arr.reshape((im_height, im_width, 3)).astype(np.uint8)
    img = Image.fromarray(arr.astype('uint8'), 'RGB')
    return img, image.format

@app.route('/analyzeImage', methods=['POST'])
def analyzeImage():
    # Validate Request
    data = request.form
    hasFilename = bool(data.get('filename', None) is not None)
    if not hasFilename:
        return(jsonify({'ok': False, 'message': 'Bad request'}), 401)
    
    # Get image by filename
    filename = data.get('filename')
    storage = gridfs.GridFS(mongo.db)
    out = storage.get_version(filename)
    image_bytes = out.read()
    img, original_format = bytes_to_image(image_bytes)

    image_list = [(filename, img)]

    # Run model
    results_dict = model.run_model(image_list)
    scores = results_dict[filename]['scores']
    classifiedImage = Image.fromarray(results_dict[filename]['classifiedImage'])
    
    # Update mongo document about this image with classification results
    classified_filename = filename + "-classified"
    mongo.db.images.update_one(
        {'filename_raw': filename}, 
        {'$set':{
            'filename_classified': classified_filename,
            'scores': scores
        }}
    )
    
    # Save the new image
    output = io.BytesIO()
    classifiedImage.save(output, format=original_format)
    storage.put(output.getvalue(), filename=classified_filename, content_type="image/png")

    if scores is not None:
        response = {'ok': True}
        return (jsonify(response), 200)
    else:
        response = {'ok': False, 'message': 'Internal Error in classification model'}
        return (jsonify(response), 500)

# # Test that the image got stored
# @app.route('/testRetrieve', methods=['GET'])
# def testRetrieve():
#     print("HERE")
#     return mongo.send_file("2-sun-mar-08-2020-18:51:49-gmt-0400-(eastern-daylight-time)-classified")