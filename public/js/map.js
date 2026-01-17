// public/js/map.js

(function () {
  if (typeof mapboxgl === "undefined") {
    console.error("❌ Mapbox GL not loaded");
    return;
  }

  if (!window.mapToken) {
    console.error("❌ MAPBOX_TOKEN missing!");
    return;
  }

  mapboxgl.accessToken = window.mapToken;

  // ✅ coordinates
  let coords = window.listingCoords;

  // validate coords
  if (!Array.isArray(coords) || coords.length !== 2) {
    console.warn("⚠️ Invalid coordinates, using fallback");
    coords = [27.1767, 78.0081];
  }

  // ✅ Create map
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/standard",   // ✅ smooth modern style
    center: coords,
    zoom: 13,
    pitch: 35,                                 // ✅ premium 3D feel
    bearing: -12,
    antialias: true,
  });

  // ✅ Add zoom + rotation controls (Airbnb feel)
  map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");

  // ✅ Add fullscreen control
  map.addControl(new mapboxgl.FullscreenControl(), "top-right");

  // ✅ smooth map load
  map.on("load", () => {
    map.resize();

    // ✅ Marker with custom color
    const marker = new mapboxgl.Marker({
      color: "#ff385c",
      scale: 1.1
    }).setLngLat(coords);

    // ✅ Popup premium style
    const popup = new mapboxgl.Popup({
      offset: 24,
      closeButton: true,
      closeOnClick: false,
      maxWidth: "250px"
    }).setHTML(`
      <div style="font-family: Plus Jakarta Sans, sans-serif;">
        <div style="font-weight:900; font-size:14px; color:#111; margin-bottom:4px;">
          ${window.listingTitle || "Listing Location"}
        </div>
        <div style="font-size:12px; color:#666; font-weight:700; margin-bottom:8px;">
          ${window.listingLocationText || ""}
        </div>
        <div style="font-size:12px; color:#777; line-height:1.4;">
          Exact address will be shared after booking.
        </div>
      </div>
    `);

    marker.setPopup(popup).addTo(map);

    // ✅ Smooth fly
    map.flyTo({
      center: coords,
      zoom: 14,
      speed: 0.9,
      curve: 1.5,
      easing: (t) => t,
      essential: true
    });

    // ✅ Auto open popup after 0.9s (smooth)
    setTimeout(() => popup.addTo(map), 900);
  });

})();
