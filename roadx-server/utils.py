## Helper functions for the server

def convertGpsCsvToDict(gpsCsv):
    result = {}
    for row in gpsCsv:
        timestamp = row[0].strip()
        latitude = row[1].strip()
        longitude = row[2].strip()
        result[timestamp] = (longitude, latitude)
    print(result)
    return result
        
def should_add_entry(scores, classifications_list, threshold):
    for entry in scores:
        print("Entry", entry)
        classification = entry.split(": ")[0]
        score = entry.split(": ")[1][0:-1] # Remove percent sign from score
        print("Score", score)
        print("Class List", classifications_list)
        inClass = len(classifications_list) == 0 or classification.lower() in classifications_list 
        print("INCLASS", inClass)
        if inClass and int(score) >= int(threshold):
            return True
    return False      