document.addEventListener("DOMContentLoaded", function () {
    mapboxgl.accessToken = MapToken;

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: coordinate||[77.5161,10.4500],
        zoom: 9
    });

    const el = document.createElement('div');
    el.id = 'marker';

    new mapboxgl.Marker(el)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(
            'Exact location provided after booking'
        ))
        .setLngLat(coordinate)
        .addTo(map);

});
