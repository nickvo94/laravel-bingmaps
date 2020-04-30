require('./bootstrap');

class PlacesJS {
   //constructor(){}

   showPlaces(data){
      var placesWrapper = document.getElementById("placesDisplay");
      var myHTML = '';
      data.forEach(element => {
         myHTML +=  '<tr id="placeid' + element.id + '" contenteditable="false" onClick="rowOnClick(this)">'
                        + '<td>' + element.id + '</td> '
                        + '<td id="titleid' + element.id + '">' + element.title + '</td>' 
                        + '<td id="latid' + element.id + '">' + parseFloat(element.lat).toFixed(2) + '</td>'
                        + '<td>' + parseFloat(element.long).toFixed(2) + '</td>'
                        + '<td>' +'<button type="submit" onClick="EditPlace('
                           + 'this, ' 
                           + element.id + ', '
                        +')">Edit</button>' + '</td>'
                        + '<td>' +'<button type="submit" onClick="DeletePlace(' 
                           + element.id + ', '
                           + element.lat + ', '
                           + element.long  
                        +')">Delete</button>' + '</td>'
                     +'</tr>';
      });      
      placesWrapper.innerHTML = myHTML;
      rowsPlaceTable = placesWrapper.getElementsByTagName('tr');

   }

   requestJSON(method, jsonBody, url, token, boolpass, callback) {
      var http_request = new XMLHttpRequest();
      var jsonObj
      var bodyStringified
      jsonBody? bodyStringified = JSON.stringify(jsonBody):'';
      console.log('sending ...' + method);
      console.log(bodyStringified)
      try{
         // Opera 8.0+, Firefox, Chrome, Safari
         http_request = new XMLHttpRequest();
      }catch (e) {
         // Internet Explorer Browsers
         try{
            http_request = new ActiveXObject("Msxml2.XMLHTTP");
              
         }catch (e) {
          
            try{
               http_request = new ActiveXObject("Microsoft.XMLHTTP");
            }catch (e) {
               // Something went wrong
               alert("Your browser broke!");
               return false;
            }
              
         }
      }
      
      http_request.onreadystatechange = function() {
      
         if (http_request.readyState == 4 && http_request.status == 200) {
            // Javascript function JSON.parse to parse JSON data
              jsonObj = JSON.parse(http_request.responseText);
              //console.log(jsonObj);
              
              if (callback) {
                  callback(jsonObj);
               }
         }
         
      }

      console.log(token)
      
      http_request.open(method, url, boolpass);
      http_request.setRequestHeader('x-csrf-token', token);
      jsonBody? http_request.setRequestHeader("Content-Type", "application/json"):'';
      jsonBody? http_request.send(bodyStringified) : http_request.send();
      console.log(http_request);
   }

   tracePinIdWithLatLong(traceLat, traceLong, listObj) {
      var latOffset = 1
      var longOffset = 1
      var foundId = 0
      listObj.forEach(element => {
         var latSub = parseFloat(Math.abs(traceLat - element.lat));
         var longSub  = parseFloat(Math.abs(traceLong - element.long));
         console.log('latsub: '+ latSub + 'longsub: '+ longSub + 'found id: ' + foundId + latOffset)   
         if( (latSub < latOffset) && (longSub < longOffset)){
            latOffset = latSub;
            longOffset = longSub;
            foundId = element.id;
                     
         } 
      });
      console.log('found Id : ' + foundId);
      return foundId;
   }

   displaySearchResults(){

      // Declare variables
      var input, filter, tr, a, i, txtValue;
      input = document.getElementById('searchInput');
      searchFilter = input.value.toUpperCase();
      tr = rowsPlaceTable;

      // Loop through all list items, and hide those who don't match the search query
      for (i = 0; i < tr.length; i++) {
         a = tr[i].getElementsByTagName("td")[1];
         txtValue = a.textContent || a.innerText;
         console.log(txtValue)
         if (txtValue.toUpperCase().indexOf(searchFilter) > -1) {
            tr[i].style.display = "";
         } else {
            tr[i].style.display = "none";
         }
      }

   }
}

module.exports = PlacesJS;

