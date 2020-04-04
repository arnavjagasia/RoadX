## Helper functions for the server

def convertGpsCsvToDict(gpsCsv):
    result = {}
    for row in gpsCsv:
        timestamp = row[0]
        longitude = row[1]
        latitude = row[2]
        result[timestamp] = (longitude, latitude)
    return result
        