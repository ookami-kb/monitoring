Ext.define('Monitoring.view.SalepointMap', {
	extend: 'Ext.Map',
	config: {
		title: 'Карта',
		id: 'salepoint-map',
		marker: null,
		listeners: {
			maprender: function(th, mp, opts) {
				if (this.coords) {
					var p = stringToCoords(this.coords);
					var pos = new google.maps.LatLng(p.lat, p.lon);
				} else {
					var pos = new google.maps.LatLng(lat, lon);
				}
				var map = this.getMap();
				var that = this;
				this.marker = new google.maps.Marker({
					position: pos,
					map: map,
					icon: this.sp_type == 'fuel' ? 'st_marker.png' : 'grocery.png'
				});
				google.maps.event.addListener(map, 'click', function(event) {
					lt = event.latLng.lat();
					ln = event.latLng.lng();
					that.marker.setPosition(new google.maps.LatLng(lt, ln));
				});
				this.setMapCenter({latitude: pos.lat(), longitude: pos.lng()});
			}
		}
	}
});
