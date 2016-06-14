L.control.HoikuenLayers = L.control.layers.extend({
    
});

L.control.hoikuenLayers = function (basemaps, overlayMaps, options) {
	return new L.control.HoikuenLayers(basemaps, overlayMaps, options);
};