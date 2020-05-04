require('./bootstrap');

var placeholderTextArr = ["Title","Lat","Long","Open hour","Open minute","Close hour","Close minute","Description"]
var inputIdTextArr;
var rowsPlaceTable;
var tempIdArr = [];

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
      return placesWrapper;
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
      tempIdArr = [];
      input = document.getElementById('searchInput');
      searchFilter = input.value.toUpperCase();
      rowsPlaceTable;

      // Loop through all list items, and hide those who don't match the search query
      for (i = 0; i < rowsPlaceTable.length; i++) {
         a = rowsPlaceTable[i].getElementsByTagName("td")[1];
         idRow = rowsPlaceTable[i].getElementsByTagName("td")[0].innerHTML;
         txtValue = a.textContent || a.innerText;
         console.log(txtValue)
         if (txtValue.toUpperCase().indexOf(searchFilter) > -1) {
            rowsPlaceTable[i].style.display = "";
            tempIdArr.push(Number(idRow));
            
         } else {
            rowsPlaceTable[i].style.display = "none";
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

   displayOpenResult(pinsArray, data){
      var date = new Date()
      var now = date.getHours() + date.getMinutes()/60 
      //now = 10; 
      console.log(rowsPlaceTable)  
      var openPlaceIds = [];
        
      for (i = 0; i < rowsPlaceTable.length; i++) {
         var opentime, closetime;
         for (x = 0; x < data.length; x++)  {
            var rowid = rowsPlaceTable[i].getElementsByTagName("td")[0].innerHTML
            console.log(rowid)           
            if(rowid == data[x].id){
               opentime = Number(data[x].open_hour) + Number(data[x].open_min)/60;
               closetime = Number(data[x].close_hour) + Number(data[x].close_min)/60;
               if(opentime < 24 && closetime < 24){
                  if(opentime < closetime){
                        if( (now > opentime && now < closetime) || now == opentime ) {
                           openPlaceIds.push(data[x].id)
                           //rowsPlaceTable[i].style.display = '';
                        }else{
                           rowsPlaceTable[i].style.display = 'none';
                        }
                  }
                  else if(opentime > closetime){
                        closetime == 0 ? closetime = 24 : '';
                        closetime = 24 + closetime;
                        
                        if ( (now > opentime && now < closetime)
                           || (now + 24 > opentime && now + 24 < closetime)
                           || now == opentime)
                        {
                           openPlaceIds.push(data[x].id)
                           //rowsPlaceTable[i].style.display = '';
                        }else{
                           rowsPlaceTable[i].style.display = 'none';
                        }
                  }else{
                     rowsPlaceTable[i].style.display = 'none';
                  }
                  
               }   

            }
         };

      }

      pinsArray.forEach(element => {
         if(openPlaceIds.indexOf(element.localPlaceId) > -1){
            element.unhidePin();
         }else{
            element.hidePin();
         }        
      });          
      
      console.log(openPlaceIds)   
   }

   placeSelectedView (element) {
      var openstr
      var closestr
      element["open_min"] < 10 ? openstr = element["open_hour"] + ':' + "0" + element["open_min"] :  openstr = element["open_hour"] + ':' + element["open_min"];
      element["close_min"] < 10 ? closestr = element["close_hour"] + ':' + "0" + element["close_min"] :  closestr = element["close_hour"] + ':' + element["close_min"];
      //var openTime = element["open_hour"] + ':' + element["open_min"] + ' - ' + element["close_hour"] + ':' + element["close_min"];
      var openTime = openstr + ' - ' + closestr; 
      console.log(openTime)
      var editDelete = document.getElementById('edit-delete-function')
      editDelete.innerHTML =   
                  '<i class="fa fa-pencil fa-lg" aria-hidden="true" type="submit" id="edit-view-mode" onClick="ActivateMode(id'
                  +')"> Edit</i>'
                  +'<i class="fa fa-trash-o fa-lg" aria-hidden="true" type="submit" onClick="DeletePlace(' 
                     + element.id 
                  +')"> Delete</i>' 
                  
      return (
               '<tr class="placerow" id="placeid' + element.id + '" contenteditable="false" onClick="rowOnClick(this)">'             
           
                  + '<td id="elementid" >' + element.id + '</td> '
                  + '<td id="titleid' + element.id + '">' + element.title + '</td>' 
                  + '<td class="lat" id="latid' + element.id + '">' + element.lat + '</td>'
                  + '<td class="long" id="longid' + element.id + '">' + element.long + '</td>'
                  + '<td class="time" id="openid' + element.id + '">' + openTime + '</td>'
                  + '<td class="description" id="describid' + element.id + '">' + element.description + '</td>'
                          
               +'</tr>'         
      )
   }
   placeListView (element) {
      var openstr
      var closestr
      element["open_min"] < 10 ? openstr = element["open_hour"] + ':' + "0" + element["open_min"] :  openstr = element["open_hour"] + ':' + element["open_min"];
      element["close_min"] < 10 ? closestr = element["close_hour"] + ':' + "0" + element["close_min"] :  closestr = element["close_hour"] + ':' + element["close_min"];
      //var openTime = element["open_hour"] + ':' + element["open_min"] + ' - ' + element["close_hour"] + ':' + element["close_min"];
      var openTime = openstr + ' - ' + closestr; 
      //var openTime = element["open_hour"] + ':' + element["open_min"] + ' - ' + element["close_hour"] + ':' + element["close_min"];     
      return ( 
         '<tr class="placerow" id="placeid' + element.id + '" contenteditable="false" onClick="rowOnClick(this)">'
            + '<td id="elementid" >' + element.id + '</td> '
            + '<td class="title" id="titleid' + element.id + '">' + element.title + '</td>' 
            + '<td class="lat" id="latid' + element.id + '">' + element.lat + '</td>'
            + '<td class="long" id="longid' + element.id + '">' + element.long + '</td>'
            + '<td class="time" id="openid' + element.id + '">' + openTime + '</td>'
            + '<td class="description" id="describid' + element.id + '">' + element.description + '</td>'            
            +'</tr>'
            +'</td>'
         +'</tr>'
      )
   }

   editView(rawData, selectedId, idArr){
      inputIdTextArr = [];
      inputIdTextArr = idArr;
      console.log(inputIdTextArr)
      var inputHtml = this.inputTemplate(rawData, selectedId);
      
         
      return (
         '<i class="fa fa-long-arrow-left fa-lg" aria-hidden="true" type="submit" onClick="BackToListView()"> Back to List view</i>'
         +'<i class="fa fa-info-circle fa-lg" aria-hidden="true"><h6>'
         +'Please enter hour time from 0 - 23 and minute time from 0 to 59 ONLY </h6></i>'
         +'<form action="#">'
         + inputHtml
         +'<br>'
         +'<i class="fa fa-floppy-o fa-lg" aria-hidden="true" type="submit" onClick="SendRequest('
         + 'this, ' 
         + selectedId + ', '
         +')"> Save</i>'
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
         '<i class="fa fa-long-arrow-left fa-lg" aria-hidden="true" type="submit" onClick="BackToListView()"> Back to List view</i>'
         +'<i class="fa fa-info-circle fa-lg" aria-hidden="true"><h6>'
         +'Please enter hour time from 0 - 23 and minute time from 0 to 59 ONLY </h6></i>'
         +'<form action="#">'
         + inputhtml
         +'<br>'
         +'<i class="fa fa-floppy-o fa-lg" aria-hidden="true" type="submit" onClick="SendRequest('
         + 'this, ' 
         + null + ', '
         +')"> Add</i>'
         +'</form> '
      )
   }
}

module.exports = ViewJS;

