//
// draw maps with openlayers, add markers, get positon
// etc ...
//
//
//
//



// draw an openstreetmap on a 
// document element with id
function drawMap(id){
  map = new OpenLayers.Map(id);
  var baseLayer = new OpenLayers.Layer.OSM();
  //baseLayer.isBaseLayer = true;
  map.addLayer(baseLayer);
  var markers = new OpenLayers.Layer.Markers( "Markers" );
  map.addLayer(markers);
  map.zoomToMaxExtent();
  return map;
}

// get a OL lonlat object
function getOLLonLat(lon,lat,map){
     var lonLat = new OpenLayers.LonLat(lon,lat).transform(new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
     map.getProjectionObject()); // to Spherical Mercator Projection);
    return lonLat;
}

// draw a marker on map at lon,lat
function drawLonLat(lonLat,themap){
  //var lonLat = new OpenLayers.LonLat(lon, lat)
  //var lonLat = new OpenLayers.LonLat(9.05211, 54.27200)
  //      .transform(
  //        new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
  //        map.getProjectionObject() // to Spherical Mercator Projection
  //      );

  //var zoom=17;
  var markers = themap.getLayersByName("Markers")[0];
  markers.addMarker(new OpenLayers.Marker(lonLat));
  //themap.setCenter (lonLat, zoom);
  return themap;
}


// append coordinates retrieved from a map 
// to a form element

function addMapLonToForm(lon,form_id) {
    $(form_id).submit(function(){ 
    //listen for submit event

    $('<input/>').attr('type','hidden')
        .attr('name', "pinpoint_lon")
        .attr('value', lon).appendTo(form_id)});
return true;
}

function addMapLatToForm(lat,form_id) {
    $(form_id).submit(function(){ 
    //listen for submit event

    $('<input/>').attr('type','hidden')
        .attr('name', "pinpoint_lat")
        .attr('value', lat).appendTo(form_id)});
return true;
}



// Control Click for maps
// helps to get lon lat info from map

OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
        defaultHandlerOptions: {
            'single': true,
            'double': false,
            'pixelTolerance': 0,
            'stopSingle': false,
            'stopDouble': false
        },

        initialize: function(options) {
            this.handlerOptions = OpenLayers.Util.extend(
                {}, this.defaultHandlerOptions
            );
            OpenLayers.Control.prototype.initialize.apply(
                this, arguments
            ); 
            this.handler = new OpenLayers.Handler.Click(
                this, {
                    'click': this.trigger
                }, this.handlerOptions
            );
        }, 

        trigger: function(e) {
            var lonlat = map.getLonLatFromPixel(e.xy);
            drawLonLat(lonlat,map);
            addMapLonToForm(lonlat.lon,"#submitreportform");
            addMapLatToForm(lonlat.lat,"#submitreportform");
            map.zoomToMaxExtent();
            
        }

});

// prepare a map for a submit form which is
// able to append its coordinates to the form 
function initMapForForm(){
    map = drawMap("submitmap");

    // map.setCenter(new OpenLayers.LonLat(0, 0), 0);
    map.zoomToMaxExtent();
    
    var click = new OpenLayers.Control.Click();
    map.addControl(click);
    click.activate();
}


function GPSPlotHandler() {

    // add to $.jqplot.postDrawHooks to be called
    //after plotting some stuff
    var x = Dajaxice.mapper.GetGPSDataPerTimeInterval(GpsCallBack,{'fromdate' : GetDate('#from'), 'todate' : GetDate('#to')});
}


function GpsCallBack(data){
    // Plot data to the map called mastermap
    var markerlayer = mastermap.getLayersByName("Markers")[0];
    markerlayer.clearMarkers();
    for (index = 0; index < data.length; ++index){
        //console.log(typeof(data[index][1]));
        var point = JSON.parse(data[index][1]);
        //console.log(point.coordinates);
        var lon = point.coordinates[1];
        var lat = point.coordinates[0];
        var lonlat = getOLLonLat(lon,lat,mastermap);
        drawLonLat(lonlat,mastermap);
    }
    markerlayer.getDataExtent();
    }


