require('./bootstrap');
let ViewJS = require('./view');
let PinJS = require('./pin');
let token = document.head.querySelector('meta[name="csrf-token"]').content;
let placesData;
let editView;
const viewArr = ['list-view-mode', 'add-view-mode', 'edit-view-mode'];
const LIST_VIEW_MODE = 0;
const ADD_VIEW_MODE = 1;
const EDIT_VIEW_MODE = 2;
const layoutArr = ['list-view-layout', 'add-view-layout', 'edit-view-layout'];
let activeMode = '';
let selectedId;
let previousId;
let retrunToListbool = false;
var inputEditIdTextArr = ["edit-title","edit-lat","edit-long","edit-openH","edit-openM","edit-closeH","edit-closeM", "edit-describ"]
var inputAddIdTextArr = ["add-title","add-lat","add-long","add-openH","add-openM","add-closeH","add-closeM", "add-describ"]

var placeId = 0;
var rowsPlaceTable;
var rawPlaceData;
var pinsArray = [];
var selected = null;

let VIEW = new ViewJS();

var editorState = {
    mode : 'default',
    selectedPin : null
}


var map,mapoptions, mapEvent; 
var pinInfobox = null;
//alert("Start");
var bingkey="AoDOQpJ63wfxcif_EWqkh4ta3LPquD-k20VBdBSwYJZS3hH9X0X5ID_5FqUJr9Pt";
var callbackFunction = "loadMapCB";

//on load initial

let newPin = null;

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

    if(activeMode === viewArr[ADD_VIEW_MODE]){
        //map.entities.clear(); 
        //setPins(placesData);
        //setLatLongOnMap(latlongObj.lat, latlongObj.long, map, null)
        //setLatLongInput(latlongObj.lat, latlongObj.long);
        newPin.setLocation(latlongObj.lat, latlongObj.long);
        setLatLongInput(latlongObj.lat, latlongObj.long);
    }
    if(activeMode === viewArr[EDIT_VIEW_MODE]){
        var selectedPin = pinsArray[pinsArray.findIndex(o => o.localPlaceId == selectedId)]
        console.log(selectedPin)
        selectedPin.setLocation(latlongObj.lat, latlongObj.long);
        editorState.selectedPin = selectedPin;
        editorState.mode = 'edit';
        setLatLongInput(latlongObj.lat, latlongObj.long);
    }
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
    console.log(activeMode)
    var pin = new PinJS(latitude, longitude, map, placesData, editorState);
    return pin;
}

function setLatLongInput(lat, long){
    var inputLatVal, inputLongVal
    switch(activeMode){
        //add mode
        case viewArr[1]:
            inputLatVal = document.getElementById('add-lat');
            inputLongVal = document.getElementById('add-long'); 
        break;
        //edit mode
        case viewArr[2]:
            inputLatVal = document.getElementById('edit-lat');
            inputLongVal = document.getElementById('edit-long');     
        break;
        default:


    }
    
    inputLatVal.value = lat;
    inputLongVal.value = long;
}

function setPins(placesData){
    console.log('set pins clear map ....' + retrunToListbool)
    if(retrunToListbool){
        map.entities.clear();
    }
 
    placesData.forEach(element => {
        //console.log(element)
        var pin = setLatLongOnMap(element.lat, element.long, map, element.id, editorState);
        pinsArray.push(pin);
    });

    console.log(pinsArray);

}

window.loadPlace = function(){
    var PlacesObj = new ViewJS(); 
    PlacesObj.requestJSON("GET", null, "map/json", token, true, (jsonObj)=>{
        console.log('Show places------');
        placesData = jsonObj;
        PlacesObj.showPlaces(placesData);
        setPins(placesData);
        window.rawPlaceData = placesData;
        console.log(window.rawPlaceData)
        activeMode = viewArr[0];
    }) ;
    
}

window.DeletePlace = function(id){
    console.log('starting to delete place');
    var PlacesObjDel = new ViewJS();
    PlacesObjDel.requestJSON("DELETE", null, "map/delete/"+id, token, true);

    loadPlace();
}

window.SendRequest = function(button, id){
    console.log('starting to edit place');
    var inputVal = []
    var method, url;
    if(id){
        inputEditIdTextArr.forEach(e => {
        inputVal.push(document.getElementById(e).value)       
        });
        method = "PUT";
        url = "map/"+id;
    }else{
        inputAddIdTextArr.forEach(e => {
        inputVal.push(document.getElementById(e).value)       
        });
        method = "POST";
        url = "map/";
    }
    
    var jsonBody = {"title": inputVal[0], "lat": inputVal[1], "long": inputVal[2], 
    "open_hour": inputVal[3], "open_min": inputVal[4], "close_hour": inputVal[5], 
    "close_min": inputVal[6], "description": inputVal[7]}

    console.log(jsonBody)   
    VIEW.requestJSON(method, jsonBody , url, token, true);

}

window.TimeFilter = function () {
    var date = new Date()
    var now = date.getHours() + date.getMinutes()/60 
    console.log(now)
    
}

window.searchFunction = function() {
    console.log('starting to search');
    var PlacesObjSearch = new ViewJS();
    PlacesObjSearch.displaySearchResults(pinsArray);
    
}

window.rowOnClick = function(row){
    console.log('row clicking ----')
    selectedId = row.getElementsByTagName('td')[0].innerHTML;
    var cellVal = selectedId;
    console.log(cellVal);

    if (window.selected) {
        previousId = window.selected.getElementsByTagName('td')[0].innerHTML;
        var previous = previousId;
        console.log(previous); 
        window.selected.innerHTML = VIEW.placeListView(
            window.rawPlaceData[
                window.rawPlaceData.findIndex(o => o.id == previous)
            ]
        );
        window.selected.style.backgroundColor = "transparent"

        pinsArray[pinsArray.findIndex(o => o.localPlaceId == previous)].unhighlightPin();
    }

    row.innerHTML = VIEW.placeSelectedView(
        window.rawPlaceData[
            window.rawPlaceData.findIndex(o => o.id == cellVal)
        ]
    );

    row.style.backgroundColor = "cyan"

    pinsArray[pinsArray.findIndex(o => o.localPlaceId == cellVal)].highlightPin();

    window.selected = row;

}

window.ActivateMode = function (mode) {
    
    activeMode = mode;
    Microsoft.Maps.Events.addHandler(map,'click',onClickRenderPage );
    document.getElementById(layoutArr[0]).style.display = 'none';

    var viewHtml;
    var viewFunc;

    switch(activeMode){
        //add mode
        case viewArr[1]:
            viewHtml = document.getElementById(layoutArr[1]);
            viewFunc = VIEW.addView(inputAddIdTextArr);
            newPin = new PinJS(0, 0, map, 1000000000, editorState);            
        break;
        //edit mode
        case viewArr[2]:
            viewHtml = document.getElementById(layoutArr[2]);
            viewFunc = VIEW.editView(window.rawPlaceData, selectedId, inputEditIdTextArr);
            
        break;
        default:

    }
      
    if(viewHtml.innerHTML){
        viewHtml.style.display = '';
    }else{
        viewHtml.innerHTML = viewFunc;
    }
         
}

window.BackToListView = function () {
    if (newPin) {
        map.entities.remove(newPin.pin);
        newPin = null;
    }
    retrunToListbool = true; 
    switch(activeMode){
        case viewArr[ADD_VIEW_MODE]:
            document.getElementById(layoutArr[1]).style.display = 'none'; 
        break;
        case viewArr[EDIT_VIEW_MODE]:
            document.getElementById(layoutArr[2]).style.display = 'none';
            editorState.mode = 'default';
            //if return not save edited pin
            var selectedPin = pinsArray[pinsArray.findIndex(o => o.localPlaceId == selectedId)]
            var originPinSelected = window.rawPlaceData[window.rawPlaceData.findIndex(o => o.id == selectedId)]
            selectedPin.setLocation(originPinSelected.lat, originPinSelected.long);

        break;
        default:
    }
    document.getElementById(layoutArr[0]).style.display = '';
    //map.entities.clear();
    //setPins(placesData);
    activeMode = viewArr[0];
    retrunToListbool = false;      
}

