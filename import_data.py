import sys
import os.path
import os
import pynmea2
from datetime import datetime

sys.path.append( "/home/achim/projects/canon-gps/canongpsreader")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "canongpsreader.settings")

from mapper.models import GPSMeasurement

FIELDS = ["position","altitude","sats","timestamp","datestamp","time","num_sats"]

#class GPSMeasurement(models.Model):
#    """
#    Represents a GPS Measurement
#    """
#
#    altitude   = models.FloatField()
#    chksumerr  = models.IntegerField()
#    fpgatime   = models.IntegerField()
#    freq       = models.IntegerField()
#    posfix     = models.IntegerField()
#    #ppsdeley
#    sats       = models.IntegerField()
#    status     = models.CharField(max_length=1)
#    time       = models.DateTimeField()
#    position   = models.PointField()
#    objects    = models.GeoManager()


def insert_log_in_db(logfilename,dryrun=True):
    """
    insert a nmea style gps file in the database
    """
    for gpsdata in convert_nmea_log(logfilename):
        gpsdata = validate_input(gpsdata,filename=logfilename)
        gpsdata = modify_fields(gpsdata)
        gpsdata = GPSMeasurement(**gpsdata)        
        if dryrun:
            print gpsdata
            print gpsdata.altitude
            print gpsdata.position
        else:
            gpsdata.save()

    return None

##############################################

def convert_nmea_log(logfilename):
    """
    Helper function to convert a nmea log file co
    to json
    """
    logfile = open(logfilename,"r")
    data = [x for x in logfile.xreadlines()]
    data = map(pynmea2.parse,data[1:]) 
    for nmea in data:
        yield jsonize_nmea(nmea)

###########################################

def jsonize_nmea(nmea):
    """
    parse a single line measurement in nmea 
    format
    """
    jsonized = dict()
    for i,j in nmea.name_to_idx.items():
        jsonized[i] = nmea.data[j]
    jsonized["lat"] = nmea.latitude
    jsonized["lon"] = nmea.longitude
    return jsonized

#############################################

def modify_fields(json_gps):
    """
    adjust some of the fields, to match the
    model names
    """
    g = dict()
    # there is a single field for position
    g["position"]   = "POINT (%4.5f %4.5f)" %(float(json_gps["lat"]),float(json_gps["lon"]))
    # timestamp
    date = get_date_from_datestamp(json_gps["datestamp"]) 
    time = get_time_from_timestamp(json_gps["timestamp"])
    print date.day,date.month,date.year
    g["time"] = datetime(date.year,date.month,date.day,time[0],time[1],time[2])
    print g["time"]
    g["altitude"] = json_gps["altitude"]
    g["sats"] = json_gps["num_sats"]
    return g

################################################

def validate_input(json_gps,filename=None):
    """
    check if the input data has the relevant 
    fields, add bogus information if not
    """
    for field in FIELDS:
        if not json_gps.has_key(field):
            json_gps[field] = None
            if (filename is not None)\
            and (field == "datestamp"):
                json_gps[field] = create_datestamp_from_filename(filename)
            
    return json_gps

#############################################

def get_date_from_filename(filename):
    """
    The date information is encoded in the
    filename
    """
    date = os.path.split(filename)[1]
    date = date.strip(".LOG")
    year = int("20" + date[:2])
    month   = int(date[2:4])
    day  = int(date[4:6])
    print "Found file for %i-%i-%i" %(month,day,year)
    date = datetime(year,month,day)
    return date

#############################################

def get_date_from_datestamp(datestamp):
    """
    convert string datestamp to date 
    """
    day   = int(datestamp[:2])
    month = int(datestamp[2:4])
    year  = int(datestamp[4:8])
    print datestamp
    print day,month,year
    if year < 2000:
        year += 2000
    date = datetime(year,month,day)
    return date

##########################################

def create_datestamp_from_filename(filename):
    """
    fill a datestamp field from the filename
    """
    date = get_date_from_filename(filename)
    return "".join(map(str,[date.day,date.month,date.year]))

############################################

def get_time_from_timestamp(timestamp):
    """
    convert string timestamp to time
    """
    hour   = int(timestamp[:2])
    minute = int(timestamp[2:4])
    second = int(timestamp[4:6])
    time = (hour,minute,second)
    return time

#######################################

if __name__ == "__main__":
    
    for i in convert_nmea_log(sys.argv[1]):
        print i

    print insert_log_in_db(sys.argv[1],dryrun=False)

