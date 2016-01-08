/* Uses openlayers 3 API
 * convenience functions for map drawing
 * markers, getting coordinates etc.
 */

function drawMap(id){
     /*
     * Initializes the mastermap
     * in a container element with id id
     */
    var controls =  ol.control.defaults().extend([new ol.control.FullScreen()]);
    var baselayer =   new ol.layer.Tile({
            source: new ol.source.OSM(
                {layer: 'sat'})
            //source: new ol.source.XYZ(
            //    {url: 'http://localhost:8000/static/osm_tiles/Geo-OSM-Tiles-0.02/tiles/{x}/{y}/{z}.png'      
            //})
          });
    var vectorlayer = new ol.layer.Vector({
        source: new ol.source.Vector({features: []})
         });
    map = new ol.Map({
        target: id,
        layers: [baselayer,vectorlayer],
        //interactions: [new ol.interaction.DragRotateAndZoom()],
        controls: controls,
        view: new ol.View({
          center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),
          zoom: 1
        })
      });
    return map;
}

/******************************************/

function GpsCallBack(jsondata){
    /*
     * Add points from data to 
     * the map
     */
    for (index = 0; index < jsondata.length; ++index){
        var data   = jsondata[index][1];
        var point  = JSON.parse(data);
        var lon = point.coordinates[1];
        var lat = point.coordinates[0];
        mastermap.addOverlay(new ol.Overlay({
            position: ol.proj.transform(
                [lon, lat],
                'EPSG:4326',
                'EPSG:3857'
                ),
            element: $('<img src="' + STATIC_URL + 'js/hosted_libs/v3.10.1/examples/data/icon.png">')
            })); 
        }
    }

/******************************************/

function GPSPlotHandlerNew(){
    /*
     * sending date data to server and request
     * mapping points
     * 
     */
     var jsonrequest = {'fromdate' : GetDate('#from'), 'todate' : GetDate('#to')}
     var requesturl = window.location.href + "ajax/getgps"
     $.ajax({
       url : requesturl, // the endpoint,commonly same url
       type : "POST", // http method
       data : jsonrequest, // data sent with the post request
       success : GpsCallBack, 
       error : function(xhr,errmsg,err) {
       console.warn(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
 }})}

/***************************************/
