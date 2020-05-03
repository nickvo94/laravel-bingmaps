require('./bootstrap');

var placeholderTextArr = ["Title","Lat","Long","Open hour","Open minute","Close hour","Close minute","Description"]
var inputIdTextArr;

class ViewJS {
   
   constructor(){}

   showPlaces(data){
      var placesWrapper = document.getElementById("placesDisplay");
      var myHTML = '';
      data.forEach(element => {
         myHTML += this.placeListView(element);                  
      });      
      placesWrapper.innerHTML = myHTML;
      rowsPlaceTable = placesWrapper.getElementsByClassName('placerow');
   }

   requestJSON(method, jsonBody, url, token, boolpass, callback) {
      var http_request = new XMLHttpRequest();
      var jsonObj
      var bodyStringified
      jsonBody? bodyStringified = JSON.stringify(jsonBody):'';
      console.log('sending ...' + method);
      //console.log(bodyStringified)
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
                  console.log('callback ........');
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

   displaySearchResults(pinsArray){

      // Declare variables
      var input, filter, tr, a, i, txtValue;
      var tempIdArr = [];
      input = document.getElementById('searchInput');
      searchFilter = input.value.toUpperCase();
      tr = rowsPlaceTable;

      // Loop through all list items, and hide those who don't match the search query
      for (i = 0; i < tr.length; i++) {
         a = tr[i].getElementsByTagName("td")[1];
         idRow = tr[i].getElementsByTagName("td")[0].innerHTML;
         txtValue = a.textContent || a.innerText;
         console.log(txtValue)
         if (txtValue.toUpperCase().indexOf(searchFilter) > -1) {
            tr[i].style.display = "";
            tempIdArr.push(Number(idRow));
            
         } else {
            tr[i].style.display = "none";
         }
      }

      console.log(tempIdArr);
      pinsArray.forEach(element => {
            if(tempIdArr.indexOf(element.localPlaceId) > -1){
               element.unhidePin();
            }else{
               element.hidePin();
            }        
      });


   }

   placeSelectedView (element) {
      var openTime = element["open_hour"] + ':' + element["open_min"] + ' - ' + element["close_hour"] + ':' + element["close_min"]; 
      return (
         '<tr class="placerow" id="placeid' + element.id + '" contenteditable="false" onClick="rowOnClick(this)">'
            + '<td id="elementid" >' + element.id + '</td> '
            + '<td id="titleid' + element.id + '">' + element.title + '</td>' 
            + '<td class="lat" id="latid' + element.id + '">' + element.lat + '</td>'
            + '<td class="long" id="longid' + element.id + '">' + element.long + '</td>'
            + '<td class="time" id="openid' + element.id + '">' + openTime + '</td>'
            + '<td class="description" id="describid' + element.id + '">' + element.description + '</td>'
         +'</tr>'
         + '<div>' 
         + '<button type="submit" id="edit-view-mode" onClick="ActivateMode(id'
         +')">Edit</button>'
         +'<button type="submit" onClick="DeletePlace(' 
            + element.id 
         +')">Delete</button>' 
         + '</div>'
         
      )
   }
   placeListView (element) {
      var openTime = element["open_hour"] + ':' + element["open_min"] + ' - ' + element["close_hour"] + ':' + element["close_min"];     
      return (
         '<tr class="placerow" id="placeid' + element.id + '" contenteditable="false" onClick="rowOnClick(this)">'
            + '<td id="elementid" >' + element.id + '</td> '
            + '<td class="title" id="titleid' + element.id + '">' + element.title + '</td>' 
            + '<td class="lat" id="latid' + element.id + '">' + element.lat + '</td>'
            + '<td class="long" id="longid' + element.id + '">' + element.long + '</td>'
            + '<td class="time" id="openid' + element.id + '">' + openTime + '</td>'
            + '<td class="description" id="describid' + element.id + '">' + element.description + '</td>'            
         +'</tr>'
      )
   }

   editView(rawData, selectedId, idArr){
      inputIdTextArr = [];
      inputIdTextArr = idArr;
      console.log(inputIdTextArr)
      var inputHtml = this.inputTemplate(rawData, selectedId);
      
         
      return (
         '<button type="submit" onClick="BackToListView()">Back to List view</button>'
         +'<form action="#">'
         + inputHtml
         +'<br>'
         +'<button type="submit" onClick="SendRequest('
         + 'this, ' 
         + selectedId + ', '
         +')">Save</button>' + '</td>'
         +'</form> '
      )
   }

   inputTemplate(rawData, selectedId){
      var localInput = '';
      var valueArr = [];      
      if(rawData && selectedId){
         var elementObj = rawData[rawData.findIndex(o => o.id == selectedId)];   
         for (var prop in elementObj) {
            if (elementObj.hasOwnProperty(prop)) {
               if (prop != 'created_at' && prop != 'updated_at' && prop != 'id') {
                  valueArr.push(elementObj[prop]);
               }
            }
         }
      }
      for(var i = 0; i < placeholderTextArr.length; i++){
         var value = valueArr[i] ? 'value="' + valueArr[i] +'"' : 'value=""';
         localInput +=
         '<br>'
         +'<label for="'+ inputIdTextArr[i] +'">'+ placeholderTextArr[i] +'</label>'
         +'<br>'
         +'<input class="edit-input" type="text" id="'+ inputIdTextArr[i] 
         +'" placeholder="'+ placeholderTextArr[i] +'"'
         + value
         + '>'

      }
      console.log('Created inputTemplate:');
      console.log(localInput)
      return localInput;

   }

   addView(idArr){
      inputIdTextArr = [];
      inputIdTextArr = idArr;
      var inputhtml = this.inputTemplate();
      return(
         '<button type="submit" onClick="BackToListView()">Back to List view</button>'
         +'<form action="#">'
         + inputhtml
         +'<br>'
         +'<button type="submit" onClick="SendRequest('
         + 'this, ' 
         + null + ', '
         +')">Add</button>' + '</td>'
         +'</form> '
      )
   }

   oldView(){
      return (
         '<tr class="placerow" id="placeid' + element.id + '" contenteditable="false" onClick="rowOnClick(this)">'
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
         +'</tr>'
      )
   }
}

module.exports = ViewJS;

