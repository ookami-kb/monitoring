Ext.define('Monitoring.view.MainMap', {
	extend: 'Ext.Map',
	
	userMarker: null,
	markers: [],
	info: new google.maps.InfoWindow(),
	
	config: {
		title: 'Карта',
		iconCls: 'maps',
		id: 'main-map',
		marker: null,
		listeners: {
			maprender: function(th, mp, opts) {
				// получаем координаты пользователя
				var pos = new google.maps.LatLng(lat, lon);
				var map = this.getMap();
				var that = this;
				
				this.userMarker = new google.maps.Marker({
					position: pos,
					map: map,
					icon: 'user_marker.png'
				});
				this.setMapCenter({latitude: pos.lat(), longitude: pos.lng()});
			}
		}
	}
});
