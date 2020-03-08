import os
import json
import model
from flask import Flask, request, jsonify
# from app import mongo

app = Flask(__name__)
app.debug=True
# ROOT_PATH = os.environ.get('ROOT_PATH')
# LOG = logger.get_root_logger(
#     __name__, filename=os.path.join(ROOT_PATH, 'output.log'))

### HELPERS
def has_json_body(content_type_string):
    """
    Returns true if the content type is JSON
    """
    return str.startswith(content_type_string, "application/json")

@app.route('/create', methods=['POST'])
def create():
    ## Validation
    if request is None or request.method != 'POST':
        return(jsonify({'ok': False, 'message': 'Bad request'}), 401)
    print(request.content_type)
    ## Parse body
    if has_json_body(request.content_type):
        data = request.get_json()
    else:
        data = json.loads(request.data)
    print(data)
    ## Handle Request
    hasFilePath = bool(data.get('imageFilePath', None) is not None)
    hasDeviceId = bool(data.get('deviceId', None) is not None)
    hasTimestamp = bool(data.get('timestamp', None) is not None)
    
    if hasFilePath and hasDeviceId and hasTimestamp:
        # mongo.db.users.insert_one(data)
        response = {'ok': True, 'message': 'User created successfully!'}
        return_code = 200
        return (jsonify(response), return_code)
    
    response = {'ok': False, 'message': 'Internal Error'}
    return_code = 500
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