# RoadX: An Automated Road Defect Inspection System

## Project Overview
Road inspection is a crucial responsibility for city governments, and efficient identification and repair of road defects can improve city transportation systems, reduce accidents, and better utilize the municipal road repair budget. RoadX is an efficient road inspection system that consists of data collection devices and an enterprise platform to automatically identify and monitor defects on city roads. Mounted on city vehicles, RoadX devices collect image, GPS, and time data of road defects. The RoadX platform applies an image recognition model to classify road defects and allows government personnel to analyze and use the data for city planning. To develop RoadX, we interviewed and collaborated with the Philadelphia Department of Streets, and we designed this first iteration of RoadX to meet their needs and integrate into their current inspection workflow.

RoadX is a Senior Design project (CIS400/CIS401) for the Department of Computer Science at the University of Pennsylvania. The RoadX Team consists of Mei Chung, Arnav Jagasia, Adele Li, Mark Lewis, and Jeffrey Zhou.

A demo of the RoadX Project can be found at [www.tinyurl.com/roadxvideo](https://www.tinyurl.com/roadxvideo) (or at its [permanent address](https://www.youtube.com/watch?v=KZLVirky-Ag&feature=youtu.be)).

## Repository Structure
This repository contains the code for the RoadX Platform. The front-end of the RoadX Platform is written in Typescript with the React framework, and the front-end code can be found in the the `roadx-client` directory. The back-end of the RoadX Platform is built with a Flask Server written in Python, and the code for the backend-server can be found in the `roadx-server` directory. We store the images and data in MongoDB Atlas with a GridFS filesystem to help with storing the images.

## How to run RoadX Locally on Mac/Linux
Note: You need access to the RoadX Remote cluster to read and write from the database. Change the MongoDB URI in `roadx-server/server.py` if you want to test it with a local database.
* To run the frontend: first, `cd roadx-client` and then `yarn start`
* To run the backend: first, `cd roadx-client` and then `env FLASK_APP=server.py flask run`
