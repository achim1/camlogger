from django.contrib.gis.db import models
import pynmea

class GPSMeasurement(models.Model):
    """
    Represents a GPS Measurement
    """

    altitude   = models.FloatField(null=True)
    chksumerr  = models.IntegerField(null=True)
    fpgatime   = models.IntegerField(null=True)
    freq       = models.IntegerField(null=True)
    posfix     = models.IntegerField(null=True)
    #ppsdeley
    sats       = models.IntegerField(null=True)
    status     = models.CharField(max_length=1,null=True)
    time       = models.DateTimeField(null=True)
    position   = models.PointField(null=True)
    objects    = models.GeoManager()

    def __repr__(self):
        return "<GPSMeasurement>"

