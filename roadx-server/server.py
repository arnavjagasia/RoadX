import os
import json
import io
import zipfile
import csv

from PIL import Image
import numpy as np
import png

import model
import tensorflow as tf

import utils

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
    # Extract parameters from request
    data = request.form
    imageZip = request.files['imageFile']

    gps_file = request.files['gpsFile']
    gps_file_stream = io.StringIO(gps_file.stream.read().decode("UTF8"), newline=None)
    gpsCsv = csv.reader(gps_file_stream)
    timestamp_to_coords = utils.convertGpsCsvToDict(gpsCsv)

    # Request parameter validation
    validators = []
    validators.append(bool(imageZip is not None and gpsCsv is not None))
    validators.append(bool(data.get('deviceId', None) is not None))
    validators.append(bool(data.get('timestamp', None) is not None))
    validators.append(bool(data.get('imageBatchUploadId', None) is not None))
    validators.append(bool(data.get('gpsUploadId', None) is not None))

    if not all(val == True for val in validators):
        return(jsonify({'ok': False, 'message': 'Bad request'}), 400)
    print("/create: Request validation successful")

    # Unpack the zip file and save images to mongo
    imageBatchUploadId = data.get('imageBatchUploadId')
    filebytes = io.BytesIO(imageZip.read())
    imageZipFile = zipfile.ZipFile(filebytes)
    counter = 1
    print("/create: Unpacking the zip...")
    for imageName in imageZipFile.namelist():
        # Skip any files in directory used for caching (ex: _MACOSX)
        if (imageName.startswith("_")):
            continue

        if (not imageName.endswith(".png")):
            continue

        print("/create: Saving image:", imageName)
        image_bytes = io.BytesIO(imageZipFile.read(imageName))

        # Save the actual image in GridFS files
        mongo.save_file(imageName, image_bytes, content_type="image/png")

        # Create data to store in DB for this record
        database_data = {
            'deviceId': data.get('deviceId'),
            'uploadTime': data.get('timestamp'),
            'imageBatchUploadId': data.get('imageBatchUploadId'),
            'imageFileName': imageName,
        }

        # Add GPS Data
        timestamps = [timestamp.strip() for timestamp in timestamp_to_coords.keys()]
        timestamp = imageName[0:-4]
        if timestamp in timestamps:
            print("Adding extra data")
            (longitude, latitude) = timestamp_to_coords[timestamp]
            database_data['timestamp'] = imageName
            database_data['longitude'] = longitude
            database_data['latitude'] = latitude

        mongo.db.images.insert_one(database_data)
        counter = counter + 1

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
    imageBatchUploadId = data.get('imageBatchUploadId', None)
    hasBatchId = bool(imageBatchUploadId is not None)
    if not hasBatchId:
        return(jsonify({'ok': False, 'message': 'Bad request'}), 400)
    print("/analyze: Request Validation successful")


    # Get all images for filename
    images = mongo.db.images.find({'imageBatchUploadId': imageBatchUploadId })
    scores = []
    for image in images:
        print("/analyze: " + image['imageFileName'])
        # Get image by filename
        filename = image['imageFileName']
        storage = gridfs.GridFS(mongo.db)
        out = storage.get_version(filename)
        image_bytes = out.read()
        img, original_format = bytes_to_image(image_bytes)

        image_list = [(filename, img)]

        # Run model
        results_dict = model.run_model(image_list)
        scores = results_dict[filename]['scores']
        classifiedImage = Image.fromarray(results_dict[filename]['classifiedImage'])
        print("/analyze: Score = ", scores)
        # Update mongo document about this image with classification results
        classified_filename = filename + "-classified"
        mongo.db.images.update_one(
            {'imageFileName': filename},
            {'$set':{
                'classifiedImageFileName': classified_filename,
                'scores': scores
            }}
        )

        # Save the new image
        output = io.BytesIO()
        classifiedImage.save(output, format=original_format)
        storage.put(output.getvalue(), filename=classified_filename, content_type="image/png")

    if all(score is not None for score in scores):
        response = {'ok': True}
        return (jsonify(response), 200)
    else:
        response = {'ok': False, 'message': 'Internal Error in classification model'}
        return (jsonify(response), 500)

@app.route('/getAllInRange', methods=['POST'])
def getAllInRange():
     # Validate Request
    data = request.form
    minLongitude = data.get('minLongitude', None)
    maxLongitude = data.get('maxLongitude', None)
    minLatitude = data.get('minLatitude', None)
    maxLatitude = data.get('maxLatitude', None)

    # Request parameters validation
    validators = []
    validators.append(bool(minLongitude is not None))
    validators.append(bool(maxLongitude is not None))
    validators.append(bool(minLatitude is not None))
    validators.append(bool(maxLatitude is not None))

    if not all(val == True for val in validators):
        return(jsonify({'ok': False, 'message': 'Bad request'}), 400)
    print("/getAllInRange: Request validation successful")

    cursor =  mongo.db.images.find({'$and': [
        {'longitude': {'$gt': minLongitude}},
        {'longitude': {'$lt': maxLongitude}},
        {'latitude': {'$gt': minLatitude}},
        {'latitude': {'$lt': maxLatitude}},
    ]})

    results = {}
    for document in cursor:
        imageFileName = document['imagemageFileName']
        longitude = document['longitude']
        latitude = document['latitude']
        results[imageFileName] = (longitude, latitude)

    response = Flask.response_class(
        response=jsonify(results),
        status=200,
        mimetype='application/json'
    )
    return response

@app.route('/addDevice', methods=['POST'])
def addDevice():
    data = request.form
    deviceID = data.get('deviceId', None)
    devicesDocument = {"deviceID": deviceID}
    mongo.db.devices.insert_one(devicesDocument)
    response = {'ok': True}
    return_code = 200
    return (jsonify(response), return_code)


@app.route('/getDevices', methods=['GET'])
def getDevices():
    devices = mongo.db.devices.find()
    response = Flask.response_class(
        response=jsonify(devices),
        status=200,
        mimetype='application/json'
    )
    return response


# # Test that the image got stored
# @app.route('/testRetrieve', methods=['GET'])
# def testRetrieve():
#     print("HERE")
#     return mongo.send_file("2-sun-mar-08-2020-18:51:49-gmt-0400-(eastern-daylight-time)-classified")
