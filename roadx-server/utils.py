## Helper functions for the server

def convertGpsCsvToDict(gpsCsv):
    result = {}
    for row in gpsCsv:
        timestamp = row[0].strip()
        latitude = row[1].strip()
        longitude = row[2].strip()
        result[timestamp] = (longitude, latitude)
    return result
        
def should_add_entry(scores, classifications_list, threshold, override=None):
    for entry in scores:
        classification = entry.split(": ")[0] if override == None else override
        score = entry.split(": ")[1][0:-1] # Remove percent sign from score
        inClass = len(classifications_list) == 0 or classification.lower() in classifications_list 
        if inClass and int(score) >= int(threshold):
            return True
    return False      