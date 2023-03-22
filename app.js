const myMap = {
  coordinates: [36.02614120745265, -114.97474835369266],
  businesses: [],
  map: {},
  markers: {},

  // build leaflet map
  buildMap() {
    this.map = L.map("map", {
      center: this.coordinates,
      zoom: 12,
    });
    // add openstreetmap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      minZoom: "15",
    }).addTo(this.map);

    // create and add geolocation marker
    const marker = L.marker(this.coordinates);
    marker
      .addTo(this.map)
      .bindPopup("<p1><b>You are here bra</b><br></p1>")
      .openPopup();
  },
  addMarkers() {
    for (var i = 0; i < this.businesses.length; i++) {
      this.markers = L.marker([this.businesses[i].lat, this.businesses[i].long])
        .bindPopup(`<p1>${this.businesses[i].name}</p1>`)
        .addTo(this.map);
    }
  },
};

// get foursquare businesses
async function getFoursquare(business) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "fsq3W7lbQ9/kmVINE0wQTCsDRp3C9pUuAGoYo/eJEa9Xr8w=",
    },
  };
  let lat = myMap.coordinates[0];
  let lon = myMap.coordinates[1];
  console.log(lat);
  console.log(lon);
  let response = await fetch(
    `https://api.foursquare.com/v3/places/search?query=${business}&limit=5&ll=${lat}%2C${lon}`,
    options
  );
  let data = await response.text();
  let pData = JSON.parse(data);
  busList = pData.results;
  return busList;
}
// process foursquare array
function processBusinesses(data) {
  let businesses = data.map((element) => {
    let location = {
      name: element.name,
      lat: element.geocodes.main.latitude,
      long: element.geocodes.main.longitude,
    };
    return location;
  });
  return businesses;
}
window.onload = async () => {
  myMap.buildMap();

  document.getElementById("submit").addEventListener("click", async (event) => {
    event.preventDefault();
    let business = document.getElementById("business").value;
    let data = await getFoursquare(business);
    console.log(data);
    myMap.businesses = processBusinesses(data);
    myMap.addMarkers();
  });
};
