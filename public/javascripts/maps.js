var map;

function getPosition(sensor){
  var lat = sensor.loc.coordinates[1];
  var lng = sensor.loc.coordinates[0];

  return {lat:lat, lng:lng};
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat:51.5073, lng:-0.1276},
    zoom: 10 
  });

  var markers = [];
//data variable is JSON array of sensors, made available in map.jade
  for(i in data){
    markers.push(new google.maps.Marker({
      position: getPosition(data[i]),
      map: map,
      title: data[i]._id
    }));
  }
} 


