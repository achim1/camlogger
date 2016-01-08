from django.http import JsonResponse
from django.template.context_processors import csrf
from .models import GPSMeasurement
from datetime import datetime
#from django.core import serializers
#from django.core.serializers.json import DjangoJSONEncoder
import json

timeformat  = "%Y-%m-%d %H:%M:%S"
timeformat2 = "%a %b %d %Y %H:%M:%S"
#'Thu Oct 01 2015 00:00:00 GMT-0500 (CDT)

# helpers
def parse_datepicker_time(timestring):
    """
    parse the time returned by datepicker thingy
    """
    timestring = timestring.split("GMT")
    timestring = timestring[0].strip()
    print (timestring)
    return datetime.strptime(timestring,timeformat2)


def GetGPSDataPerTimeInterval(request):
    """
    Get the gps data from the database for
    a given time interval
    """
    fromdate = None
    todate   = None
    if request.method == 'POST':
        if request.is_ajax():
            #Always use get on request.POST. Correct way of querying a QueryDict.
            fromdate = request.POST.get('fromdate')
            todate = request.POST.get('todate')

    fromdate = parse_datepicker_time(fromdate)
    todate   = parse_datepicker_time(todate)
    response = GPSMeasurement.objects.filter(time__range=(fromdate,todate))
    response = sorted(zip([x.time for x in response],[x.position for x in response]),key= lambda x:x[0])
    # make the datetime readable for jqplot
    response = [(x[0].strftime(format=timeformat),x[1]) for x in response]
    response = [(x[0],x[1].json) for x in response]
    return JsonResponse(response,safe=False)

