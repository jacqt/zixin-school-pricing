import DataModel
import json

FILENAME = 'FeeData.csv'
OUTPUTNAME = 'FeeData.json'

def getData():
    '''
    Gets the data from the csv file
    Returns a list of Schools
    '''
    f_open = open(FILENAME, 'r')
    #Ignore labels
    f_open.readline()
    f_open.readline()
    schools = []
    for line in f_open.readlines():
        try:
            schools.append(DataModel.School(line))
        except:
            print "Could not parse", line
    return schools



if __name__ == '__main__':
    print "Starting up the json parser"
    schools = getData()
    jsonArr = []
    for school in schools:
        try:
            jsonArr.append(school.getSerializeableObject())
        except:
            print "Could not serialize", school.name
    jsonFile = open(OUTPUTNAME, 'w')
    jsonFile.write(json.dumps(jsonArr))


