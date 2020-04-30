require('./bootstrap');
let PlacesJS = require('./places');

class PinJS {
   /* map;
   location;    
   name;
   htmlUI;
   hoverColor = 'red';
   defaultColor = 'purple'; */

   constructor (latitude, longitude, bingMap, placeId) {        
       if (!bingMap) {
          console.log("ERROR no map");
          return;
       }
       this.localPlaceId = placeId;
       this.location = new Microsoft.Maps.Location(latitude, longitude);
       this.pin = new Microsoft.Maps.Pushpin(this.location, {'draggable': false});
              
       bingMap.entities.push(this.pin);
       console.log("new pin -------------");
       if(placeId){
            Microsoft.Maps.Events.addHandler(this.pin, 'mouseover', (e) => {
               e.target.setOptions({ color: 'red' });
               this.highlightPinInfo(e, true);
         });
            Microsoft.Maps.Events.addHandler(this.pin, 'mouseout', (e) => {
               e.target.setOptions({ color: 'purple' });
               this.highlightPinInfo(e, false);
         });   

       }                                        
   }

   highlightPinInfo(e, hilightBool){   
       
      if(hilightBool){
           var latlongInfo = getLatlngEvent(e);
           //var PlaceObjId = new PlacesJS();
           //placeId = PlaceObjId.tracePinIdWithLatLong(latlongInfo.lat, latlongInfo.long, placesData);
           //this.localPlaceId = placeId;
           var rowSelected = document.getElementById('placeid'+ this.localPlaceId);
           console.log(latlongInfo + ' bool: ' + hilightBool + ' placeid: ' + this.localPlaceId )
           if(this.localPlaceId != 0){
               rowSelected.style.backgroundColor = "cyan";
           }
      }else{
           var rowSelected = document.getElementById('placeid'+ this.localPlaceId);
           if(this.localPlaceId != 0){
               rowSelected.style.backgroundColor = "transparent";
           }
           //this.localPlaceId = 0;
       }
       
   }

}

module.exports = PinJS;

