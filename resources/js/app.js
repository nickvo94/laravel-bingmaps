require('./bootstrap');
let PlacesJS = require('./places');
let PinJS = require('./pin');
let token = document.head.querySelector('meta[name="csrf-token"]').content;
let placesData;

var placeId = 0;
var rowsPlaceTable;
var pinsArray = [];


var map,mapoptions; 
var pinInfobox = null;
//alert("Start");
var bingkey="AoDOQpJ63wfxcif_EWqkh4ta3LPquD-k20VBdBSwYJZS3hH9X0X5ID_5FqUJr9Pt";
var callbackFunction = "loadMapCB";

//on load initial
loadMapCB = function()
{
    console.log('start init')
    

    var loc=new Microsoft.Maps.Location(60, 24)
    mapOptions ={   credentials: bingkey,
                    center: loc,
                    zoom: 4,
                    mapTypeId: Microsoft.Maps.MapTypeId.road
                };

    map = new Microsoft.Maps.Map(document.getElementById('myMap'), mapOptions);
    Microsoft.Maps.Events.addHandler(map, 'click',onClickRenderPage );

}

function onClickRenderPage(e){
    var latlongObj = getLatlngEvent(e);
    console.log(latlongObj.lat + ' --- ' + latlongObj.long);

    map.entities.clear();
    setPins(placesData);
    setLatLongOnMap(latlongObj.lat, latlongObj.long, map, null)
    setLatLongInput(latlongObj.lat, latlongObj.long);

}

window.getLatlngEvent = (e) => {
    console.log(e)
    if (e.targetType == "map") {
        var point = new Microsoft.Maps.Point(e.getX(), e.getY());
        var locTemp = e.target.tryPixelToLocation(point);
        var latitudeDec = locTemp.latitude;
        var longitudeDec = locTemp.longitude;
        
        return {lat: latitudeDec, long: longitudeDec};    
    }
    if (e.targetType == "pushpin") {
        var latitudeDec = e.target.geometry.y;
        var longitudeDec = e.target.geometry.x;
        
        return {lat: latitudeDec, long: longitudeDec};    
    }
}

function setLatLongOnMap(latitude, longitude, map, placesData){
    var pin = new PinJS(latitude, longitude, map, placesData);
    return pin;
}

function setLatLongInput(lat, long){
    var inputLatVal = document.getElementsByName('lat');
    var inputLongVal = document.getElementsByName('long');
    inputLatVal[0].value = lat;
    inputLongVal[0].value = long;
}

function setPins(placesData){
    map.entities.clear();
    var pinsArray = [];
 
    placesData.forEach(element => {
        //console.log(element)
        var pin = setLatLongOnMap(element.lat, element.long, map, element.id);
        pinsArray.push(pin);
    });
    console.log(pinsArray);

}

window.loadPlace = function(){
    var PlacesObj = new PlacesJS(); 
    PlacesObj.requestJSON("GET", null, "map/json", token, true, (jsonObj)=>{
        console.log('Show places');
        placesData = jsonObj;
        PlacesObj.showPlaces(placesData);
        setPins(placesData);
    }) ;
    
}

window.DeletePlace = function(id, lat, long){
    console.log('starting to delete place');
    var PlacesObjDel = new PlacesJS();
    PlacesObjDel.requestJSON("DELETE", null, "map/delete/"+id, token, true);

    loadPlace();
}

window.EditPlace = function(button, id){
    console.log('starting to edit place');

    var x = document.getElementById("placeid" + id);
    if (x.contentEditable == "true") {
        x.contentEditable = "false";
        button.innerHTML = "Edit";
        var titleEdited = document.getElementById("titleid" + id).innerHTML;
        var latEdited = document.getElementById("latid" + id).innerHTML;
        var PlacesObjEdit = new PlacesJS();
        var jsonBody = {"title": titleEdited, "lat": latEdited}
        PlacesObjEdit.requestJSON("PUT", jsonBody , "map/"+id, token, true);
    } else {
        x.contentEditable = "true";
        button.innerHTML = "Save";
    }

    //loadPlace();
}

window.searchFunction = function() {
    console.log('starting to search');
    var PlacesObjSearch = new PlacesJS();
    PlacesObjSearch.displaySearchResults();
    
}

window.rowOnClick = function(row){
    var cellVal = row.getElementsByTagName('td')[0].innerHTML;
    console.log(cellVal)
    pinsArray.forEach(element => {
        if(element.localPlaceId){
            new PinJS(element.location.latitude, element.location.longitude, map, cellval)
        }
    });

}

