Ext.define('Monitoring.store.Salepoints', {
	extend: 'Ext.data.Store',
	config: {
		model: 'Monitoring.model.Salepoint',
	    proxy: {
	        type: 'localstorage',
	        id: 'salepoints',
	    },
	    autoLoad: true,
	    sorters: [{
	    	property: 'coords',
	    	transform: function(value) {
	    		var coords = stringToCoords(value);
	    		if (coords) {
	    			// var userPosition = new google.maps.LatLng(lat, lon);
	    			// var salepointPosition = new google.maps.LatLng(coords.lat, coords.lon);
	    			return calculateDistance(lat, lon, coords.lat, coords.lon);
	    			// return google.maps.geometry.spherical.computeDistanceBetween(userPosition, salepointPosition);
	    		}
	    		return 0;
	    	}
	    }],
	    filters: [new Ext.util.Filter({filterFn: function(item) {
    		var coords = stringToCoords(item.get('coords'));
	    		if (coords) {
	    			// var userPosition = new google.maps.LatLng(lat, lon);
	    			// var salepointPosition = new google.maps.LatLng(coords.lat, coords.lon);
	    			// return google.maps.geometry.spherical.computeDistanceBetween(userPosition, salepointPosition) < 30000;
	    			return calculateDistance(lat, lon, coords.lat, coords.lon) < 30000;
	    		}
	    		return false;
    	}})]
	}
});