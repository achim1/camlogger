from django.conf.urls import patterns, include, url
import camlogger.views as indexviews
import mapper.ajax as mapviews
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = [
    url(r'^$', indexviews.index, name='index'),
    #url(r'^$', indexviews.search, name='search'),
    url(r'^ajax/getgps', mapviews.GetGPSDataPerTimeInterval, name='GetGPSDataPerTimeInterval')]
