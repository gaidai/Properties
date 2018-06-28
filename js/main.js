'use strict';

var allProperties;
var activeProperty = 0;

$( document ).ready(function() {
  // fetch JSON data from mocky.io or from local file
  fetchProperties();

});




const fetchProperties = async () => {
  const getProperties = async () => await (
    await fetch(`https://cors.io/?http://www.mocky.io/v2/5b3461e43200004c00d1e396`)).json();
  try {   
    const {properties} = await getProperties(); 
    allProperties = [...properties]    
    $('#load_spinner').hide(1);
      renderPropertyData();   
  } catch (exception) {

    console.error(exception);
    $('#load_spinner').hide(1);
    console.error(`Failed to retrieve properties from mocky.io, load from file "js/properties.json"`);
    //Alternative way to load data
    getJSONFromFile();   
  }
  
};

const getJSONFromFile = function () { 
    loadJSONFromFile(function(response) {
      const {properties} = JSON.parse(response);
      allProperties = [...properties];
      renderPropertyData();
    });
  };

function loadJSONFromFile(callback) {   

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'js/properties.json', true); 
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {       
      callback(xobj.responseText);
    }
  };
  xobj.send(null);  
}
// change rendered HTML data
const renderPropertyData = (propertyIndex = 0) => {
  $('img').first().attr('src', 'images/' + allProperties[propertyIndex].name+'.jpg');
  initMapByAddress(allProperties[propertyIndex].address); 
    
  $('#name').html( allProperties[propertyIndex].name);   
  $('#address').text(allProperties[propertyIndex].address);
  $('#propertyType').text(allProperties[propertyIndex].propertyType);
  $('#propertyClass').text(allProperties[propertyIndex].propertyClass);
  $('#floors').text(allProperties[propertyIndex].floors);
  $('#totalBuildingArea').text( numberWithCommas( allProperties[propertyIndex].totalBuildingArea ) );
  $('#tenancy').text(allProperties[propertyIndex].tenancy);
  $('#noOfTenant').text(allProperties[propertyIndex].noOfTenant);
  $('#website').text(allProperties[propertyIndex].website);
  $('#website').attr('href','http://'+ allProperties[propertyIndex].website );
  $('#yearBuilt').text(allProperties[propertyIndex].yearBuilt);
  $('#description').text(allProperties[propertyIndex].description);
  $('#records').text( allProperties[propertyIndex].availability.length + ' records' );
  changeNavNumber();
  renderAvailabilities(propertyIndex);
};

window.initMap = function (x, y) {
  
  var lat = parseFloat(x);
  var lng = parseFloat(y);

  // The location of Property ( Tower )
  var gps = {lat: lat, lng: lng};
  var map = new google.maps.Map(
  document.getElementById('map'), {zoom: 6, center: gps});
  var marker = new google.maps.Marker({position: gps, map: map});
}

//Find GPS coordinates by address and initMap
const initMapByAddress = async (adress) => {
  var resultlat = ''; var resultlng = '';
  const getGPS = async () => await (
    await fetch('http://maps.google.com/maps/api/geocode/json?address=' + adress)).json();
      
  try {  

    const gps = await getGPS(); 
    for (var key in gps.results) {
      resultlat = gps.results[key].geometry.location.lat;
      resultlng = gps.results[key].geometry.location.lng;
    }
    initMap(resultlat, resultlng);
     
  } catch (exception) {
    console.error(exception);    
  }
  
}
$('#next').click(function(event) {
  
  if ( activeProperty == allProperties.length - 1){
    activeProperty = 0;
  } else {
    activeProperty++;
  }
  renderPropertyData(activeProperty);

});
$('#prev').click(function(event) {
   
  if ( activeProperty == 0 ){
    activeProperty = allProperties.length - 1;
  } else {
    activeProperty--;
  }
  renderPropertyData(activeProperty);

});
const changeNavNumber = () =>{

  $('.nav_buttons> p').text(`${activeProperty+1}/${allProperties.length}`)
}
function renderAvailabilities(propertyIndex){
  let table = $('tbody');
  table.empty();
  var tableRows = '';
  allProperties[propertyIndex].availability.forEach( function(element, index) {   
    tableRows += `<tr><td>${element.unitNameNumber}</td><td>${element.recordType}</td><td>${numberWithCommas(element.availableArea)}.00 sf</td></tr>` ;
  });
  
  table.append( tableRows )
}
//format number properties
const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}