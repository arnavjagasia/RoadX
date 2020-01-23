import os
from flask import Flask, request, jsonify
# from app import mongo

app = Flask(__name__)
# ROOT_PATH = os.environ.get('ROOT_PATH')
# LOG = logger.get_root_logger(
#     __name__, filename=os.path.join(ROOT_PATH, 'output.log'))


@app.route('/create', methods=['POST'])
def create():
    data = request.get_json()
    if request.method == 'POST':
        hasFilePath = bool(data.get('imageFilePath', None) is not None)
        hasDeviceId = bool(data.get('deviceId', None) is not None)
        hasTimestamp = bool(data.get('timestamp', None) is not None)
        
        if hasFilePath and hasDeviceId and hasTimestamp:
            # mongo.db.users.insert_one(data)
            response = {'ok': True, 'message': 'User created successfully!'}
            return_code = 200
        else:
            response = {'ok': False, 'message': 'Bad request parameters!'}
            return_code = 401

        return (jsonify(response), return_code)