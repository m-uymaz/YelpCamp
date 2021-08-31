mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campground, // starting position [lng, lat]
    zoom: 9 // starting zoom
});
// Navigation controlls on the map
map.addControl(new mapboxgl.NavigationControl());


// Create a new marker.
new mapboxgl.Marker()
    .setLngLat(campground)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
        .setHTML(
            `<h3>${mapPopup}</h3>`
        )
    )
    .addTo(map);