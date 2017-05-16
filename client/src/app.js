import './../main.less';
var socket = new WebSocket('ws://localhost:8091'),
    mymap = L.map('mapid').setView([40.505, 100.09], 4),
    markers = {},
    markersList = {},
    online = {};

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib3JraGFuamFmYXJvdnIiLCJhIjoiY2oybjdqcjNiMDAyZTJxcGFjd2c3aDZpZiJ9.Y7-ipbN_ZdCrZcNhuCySLA', {
    zoom: 15
}).addTo(mymap);

var clusterer = L.markerClusterGroup();

socket.onopen = function(e) {
  console.log('success connection');

  var message = {};
  message.name = 'start';
  socket.send(JSON.stringify(message));
};

socket.onmessage = function(messageServer) {
  var message = JSON.parse(messageServer.data);
  switch (message.name) {
      case 'location':
        addLocation(message.data);
        break;
      case 'status':
        locationsStatus(message.data); 
        break;
  }
};

// window.addEventListener('click', (e) => {
//     if(e.target.dataset.mac) {
//         markersList[e.target.dataset.mac].openPopup();
//         console.log(e.target);
//     }
// })

function addLocation (data){
    for (let i=0; i < data.length; i++) {
        markers[data[i].mac] = {
            mac: data[i].mac,
            location: data[i].hasOwnProperty('location') ? [data[i]['location']['lat'], data[i]['location']['lon']] : []
       };
    }
}
var onlineList = document.getElementById('onlineList');

function locationsStatus (data) {
    onlineList.innerHTML = '';
    for (let i=0; i < data.length; i++) {
        let mac = data[i].mac;
        if(markers.hasOwnProperty(mac)){
            online[mac] = {...markers[mac], ...data[i]};
        }
    }
    for(let prop in online) {
        
       setTimeout(() => {
        //  if(online[prop].status.isOnline) {
        //     onlineList.innerHTML += `<li data-mac="${prop}">${online[prop].status.name} - ${online[prop].location.join(',')}</li>`;
        // }

        if(markersList.hasOwnProperty(prop)) {
            var newLatLng = new L.LatLng(online[prop].location[0], online[prop].location[1]);
            
            markersList[prop].setLatLng(newLatLng).update();
        } else {
            markersList[prop] = L.marker(online[prop].location, {id: prop });
            clusterer.addLayer(markersList[prop]);
            mymap.addLayer(clusterer);
        }

        markersList[prop].bindPopup(`<b>${online[prop].status.name} (${prop})</b><br/> - ${online[prop].status.isOnline ? 'Online' : 'Offline'}`);
       }, 500)
    }
}