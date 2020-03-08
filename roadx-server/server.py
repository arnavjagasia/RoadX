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
        'filename': data.get('filename')
    }
    mongo.db.images.insert_one(database_data)

    response = {'ok': True}
    return_code = 200
    return (jsonify(response), return_code)

def load_image_into_numpy_array(image):
    (im_width, im_height) = image.size
    arr = np.array(image.getdata())[...,:3]
    return arr.reshape((im_height, im_width, 3)).astype(np.uint8)

@app.route('/analyzeImage', methods=['POST'])
def analyzeImage():
    # Get image by filename
    data = request.form
    hasFilename = bool(data.get('filename', None) is not None)
    if not hasFilename:
        return(jsonify({'ok': False, 'message': 'Bad request'}), 401)
    
    filename = data.get('filename')
    out = gridfs.GridFS(mongo.db).get_version(filename)
    image_bytes = out.read()
    print(len(image_bytes))

    img = Image.open(io.BytesIO(image_bytes))
    # plt.imshow(np.array(img))
    # plt.savefig("test3.png")
    # arr = np.array(img)
    # print(arr.shape)
    # arr = load_image_into_numpy_array(img) 
    # print(arr.shape)
    # png.from_array(arr, 'L').save("test.png")
    # # response = mongo.send_file(filename)
    # print(arr)
    # return response
    # Run model on image
    image_np, class_and_scores = model.run_model(img)
    # plt.imshow(image_np)
    
    response = {'ok': False, 'message': 'Internal Error'}
    return_code = 500
    return (jsonify(response), return_code)