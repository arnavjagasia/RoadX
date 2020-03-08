# Road Damage Detection Model
# Originally designed by SekiLab (https://github.com/sekilab/RoadDamageDetector)
# Used under MIT License
#
# Road Inspection Senior Design Team, October 2019

from xml.etree import ElementTree
from xml.dom import minidom
import collections
import os
import matplotlib.pyplot as plt
import matplotlib as matplot
import seaborn as sns
import numpy as np
import sys
import tarfile
import tensorflow as tf
import zipfile
from collections import defaultdict
from io import StringIO
from matplotlib import pyplot as plt
from PIL import Image
from tensorflow import keras
tf.compat.v1.logging.set_verbosity(tf.compat.v1.logging.ERROR)

# Object Detection Imports
from object_detection.utils import label_map_util
from object_detection.protos import string_int_label_map_pb2
from object_detection.utils import visualization_utils as vis_util

PATH_TO_CKPT =  'trainedModels/ssd_mobilenet_RoadDamageDetector.pb' # Actual model for the object detection
PATH_TO_LABELS = 'trainedModels/crack_label_map.pbtxt' # Strings to add correct label for each box
NUM_CLASSES = 8
IMAGE_SIZE = (12, 8)
IMAGE_INPUT_DIRECTORY = '/ImageData/None/resized' # Relative path to input directory 

def load_image_into_numpy_array(image):
    (im_width, im_height) = image.size
    return np.array(image.getdata()).reshape((im_height, im_width, 3)).astype(np.uint8)

def load_images():
    input_images = []
    current_path = os.getcwd() + IMAGE_INPUT_DIRECTORY
    for filename in os.listdir(current_path):
        if filename == ".DS_Store":
            continue
        input_images.append(current_path + "/" + filename)
    return input_images

def switch_deepest_directory(filepath, newdir):
    filepath_tokens = filepath.split("/")
    filename = filepath_tokens.pop()
    filepath_tokens.pop()
    filepath_tokens.append(newdir)
    filepath_tokens.append(filename)
    return "/".join(filepath_tokens)

def convert_input_to_output_path(input_path):
    tokens = input_path.split(".")
    filepath = tokens[0]
    filepath = switch_deepest_directory(filepath, "outputs")
    output_path = filepath + "_labeled"
    return output_path

def listToStringWithoutBrackets(list1):
    return str(list1).replace('[','').replace(']','')

def run_model(images):
    # Import Model 
    detection_graph = tf.Graph()
    with detection_graph.as_default():
        od_graph_def = tf.compat.v1.GraphDef()
        with tf.compat.v2.io.gfile.GFile(PATH_TO_CKPT, 'rb') as fid:
            serialized_graph = fid.read()
            od_graph_def.ParseFromString(serialized_graph)
            tf.import_graph_def(od_graph_def, name='')

    # Import Label Map and Categories
    label_map = label_map_util.load_labelmap(PATH_TO_LABELS)
    categories = label_map_util.convert_label_map_to_categories(label_map, max_num_classes=NUM_CLASSES, use_display_name=True)
    category_index = label_map_util.create_category_index(categories)

    with detection_graph.as_default():
        with tf.compat.v1.Session(graph=detection_graph) as sess:
            # Definite input and output Tensors for detection_graph
            image_tensor = detection_graph.get_tensor_by_name('image_tensor:0')
            
            # Each box represents a part of the image where a particular object was detected.
            detection_boxes = detection_graph.get_tensor_by_name('detection_boxes:0')
            
            # Each score represent how level of confidence for each of the objects.
            # Score is shown on the result image, together with the class label.
            detection_scores = detection_graph.get_tensor_by_name('detection_scores:0')
            detection_classes = detection_graph.get_tensor_by_name('detection_classes:0')
            num_detections = detection_graph.get_tensor_by_name('num_detections:0')
            for image in images:
                # the array based representation of the image will be used later in order to prepare the
                # result image with boxes and labels on it.
                try: 
                    image_np = load_image_into_numpy_array(image)
                except ValueError:
                    print("The image could not be reshaped correctly.")
                    continue
                # Expand dimensions since the model expects images to have shape: [1, None, None, 3]
                image_np_expanded = np.expand_dims(image_np, axis=0)
                
                # Actual detection.
                (boxes, scores, classes, num) = sess.run(
                    [detection_boxes, detection_scores, detection_classes, num_detections],
                    feed_dict={image_tensor: image_np_expanded})
                
                # Visualization of the results of a detection.
                vis_util.visualize_boxes_and_labels_on_image_array(
                    image_np,
                    np.squeeze(boxes),
                    np.squeeze(classes).astype(np.int32),
                    np.squeeze(scores),
                    category_index,
                    min_score_thresh=0.3,
                    use_normalized_coordinates=True,
                    line_thickness=3)
                
                class_and_scores = vis_util.get_classes_scores(
                    image_np,
                    np.squeeze(boxes),
                    np.squeeze(classes).astype(np.int32),
                    np.squeeze(scores),
                    category_index,
                    min_score_thresh=0.3,
                    use_normalized_coordinates=True,
                    line_thickness=3)
        
                # plt.figure(figsize=IMAGE_SIZE)
                # plt.imshow(image_np)
                # outputstr = "{filename:'" + convert_input_to_output_path(image_path) + "', classification: {" + listToStringWithoutBrackets(class_and_scores) + "}} \n" 
                # file1.write(outputstr)
                # plt.savefig(convert_input_to_output_path(image_path))
                return image_np, class_and_scores