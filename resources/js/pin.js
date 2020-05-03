require('./bootstrap');
let ViewJS = require('./view');

class PinJS {
   /* map;
   location;    
   name;
   htmlUI;
   hoverColor = 'red';
   defaultColor = 'purple'; */

   constructor (latitude, longitude, bingMap, placeId, editorStateOb) {
       if (!bingMap) {
          console.log("ERROR no map");
          return;
       }
       let pinHighlighted = false;
       this.localPlaceId = placeId;
       this.location = new Microsoft.Maps.Location(latitude, longitude);
       this.pin = new Microsoft.Maps.Pushpin(this.location, {'draggable': false});
       this.clickCB = null;
       this.editorStateOb = editorStateOb;
                     
       bingMap.entities.push(this.pin);
       //console.log("new pin -------------");
       if (placeId) {
            //Microsoft.Maps.Events.addHandler(this.pin, 'click', (e) => this._defaultClickCB(e));
            
            this.clickCB = Microsoft.Maps.Events.addHandler(this.pin, 'click', (e) => this._clickCB(e));            
/*             Microsoft.Maps.Events.addHandler(this.pin, 'mouseout', (e) => {
               e.target.setOptions({ color: 'purple' });
               //this.highlightTableInfo(e, false);
         }); */   

       }                                        
   }

   _clickCB (e) {
      switch (this.editorStateOb.mode) {
         case 'default':
            e.target.setOptions({ color: '#090' });
            this.editorStateOb.selectedPin = this;
            window.rowOnClick(document.getElementById('placeid' + this.localPlaceId))
            
         case 'edit':
            if (this.editorStateOb.selectedPin === this) {
               console.log('this pin is selected');
               this.setLocation(this.location.latitude, this.location.longitude)
            } 

      }    
   }

   setLocation (latitude, longitude) {
      this.location = new Microsoft.Maps.Location(latitude, longitude);
      this.pin.setLocation(this.location);
   }

/*    highlightTableInfo(e, hilightBool){   
       
      if(hilightBool){
           var latlongInfo = getLatlngEvent(e);
           //var PlaceObjId = new ViewJS();
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
       
   } */

   highlightPin(){
      this.pin.setOptions({color: '#090'});
   }

   unhighlightPin(){
      console.log('unhightlight pin ......')
      this.pin.setOptions({color: 'purple'});
   }

   hidePin(){
      this.pin.setOptions({visible: false});
   }

   unhidePin(){
      this.pin.setOptions({visible: true});
   }

}

module.exports = PinJS;

