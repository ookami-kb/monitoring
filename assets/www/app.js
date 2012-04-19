var lat = 0, lon = 0;
var geo = null;

var modelobj;
Ext.ns('DbConnection');

var dbconnval = {
	dbName: "monitoring",
	dbDescription: "testdb"
};

var offersStore;

function geoSuccess(position) {
	lat = position.coords.latitude;
	lon = position.coords.longitude;
	
    var main_map = Ext.getCmp('main-map');
    main_map.userMarker.setPosition(new google.maps.LatLng(lat, lon));
    
    main_map.setMapCenter({latitude: lat, longitude: lon});
    
    Ext.data.StoreManager.lookup('Salepoints').sort();
    Ext.data.StoreManager.lookup('Salepoints').filter();
    
    var markers = main_map.markers;
    for (var i=0; i<markers.length; i++) {
    	markers[i].setMap(null);
    }
    markers = [];
    var salepoints = Ext.data.StoreManager.lookup('Salepoints').getData().items;
    for (var i=0; i<salepoints.length; i++) {
    	if (i > 9) break;
    	var st_coords = stringToCoords(salepoints[i].data.coords);
    	var st_marker = new google.maps.Marker({
    		map: main_map.getMap(),
    		position: new google.maps.LatLng(st_coords.lat, st_coords.lon),
    		icon: salepoints[i].data.type == 'fuel' ? 'st_marker.png' : 'grocery.png',
    		text: salepoints[i].data.name + '<br />' + salepoints[i].data.address
    	});
    	markers.push(st_marker);
    	google.maps.event.addListener(markers[markers.length-1], 'click', function() {
    		main_map.info.setContent(this.text);
    		main_map.info.open(main_map.getMap(), this);
    	});
    }
    main_map.markers = markers;
}

function geoError(error) {
	console.log(error);
}
// храним имя пользователя и пароль
var username = localStorage.getItem('stations_username');
var password = localStorage.getItem('stations_password');

// Ext.setup({
	// onReady: function() {
		// console.log('ready');
		// Ext.DbConnection = Ext.create('Ext.Sqlite.Connection',dbconnval);
//     	
    	// offersStore = Ext.create('Ext.data.Store',{
			// model  : 'Monitoring.model.Offer',
			// autoLoad: true
		// });
	// }
// });

Ext.application({
    name: 'Monitoring',
    
    requires: ['Ext.data.Store', 'Ext.navigation.View', 'Ext.dataview.List',
			   'Ext.form.Panel', 'Ext.util.GeoLocation', 'Ext.tab.Panel',
			   'Ext.data.JsonP', 'Ext.Map', 'Ext.data.proxy.LocalStorage',
			   'Ext.field.Password', 'Monitoring.forms.Sync', 
			   'Monitoring.forms.Salepoint', 'Monitoring.forms.Product',
			   'Ext.data.reader.Array'],

    // controllers: ['Main'],
    models: ['Salepoint', 'Brand', 'Product'],
    views: ['Main', 'Salepoints', 'MainMap', 'BrandList', 'SalepointMap'],
    stores: ['Salepoints', 'Brands', 'Products'],

    launch: function() {
    	console.log('launch');
    	Ext.DbConnection = Ext.create('Ext.Sqlite.Connection',dbconnval);
    	
    	Ext.define('Monitoring.model.Offer', {
    extend: 'Ext.data.Model',

    config: {
    	idProperty : 'uniqueid', // if we have field with name as id, conflicts happens with default idProperty(id) which always have value as ext-record-x
		clientIdProperty : 'id',
        fields: [
        	{name: 'salepoint_id', type: 'int'},
            {name: 'price', type: 'float'},
            {name: 'source_code', type: 'string'},
            {name: 'source_type', type: 'string'},
            {name: 'title', type: 'string'},
            {name: 'whitebrand_id', type: 'int'},
            {name: 'is_new', type: 'boolean'},
            {
				name: 'id',
				type: 'int',
				fieldOption: 'PRIMARY KEY'
			}
        ],
        proxy: {
        	type: 'sqlitestorage',
        	dbConfig: {
				tablename: 'offers_tables',
				dbConn: Ext.DbConnection
				//dbQuery 	: 'SELECT * FROM contact_table limit 0,1' //dbQuery only works with read operation
			},
			reader: {
				type: 'array'
			}
        }
    },
    writer: {
		type: 'array'
	},
	
});

    	offersStore = Ext.create('Ext.data.Store',{
			model  : 'Monitoring.model.Offer',
			autoLoad: false
		});
		
Ext.define('Monitoring.view.ProductList', {
    extend: 'Ext.dataview.DataView',
    xtype: 'productlist',
    
    requires: ['Monitoring.view.ProductListItem'],
    
    config: {
    	title: 'Продукты',
    	useComponents: true,
    	cls: 'product-list',
    	defaultType: 'productlistitem',
	    id: 'pr-list',
	    // itemTpl: ['{title} {source_code} {price}'],
	    store: offersStore,
    }
});
		
    	var v = Ext.create('Monitoring.view.Main');
    	var salepoints = Ext.create('Monitoring.view.Salepoints');
    	v.push(salepoints);
    	
    	
    	// Ext.data.StoreManager.lookup('Salepoints').load();
    	
    	Ext.create('Ext.tab.Panel', {
    		fullscreen: true,
    		id: 'main-tab-panel',
    		tabBarPosition: 'bottom',
    		items: [
    			v,
    			Ext.create('Monitoring.view.MainMap'),
    			Ext.create('Monitoring.forms.Sync')
    		]
    	});
    	
    	navigator.geolocation.getCurrentPosition(geoSuccess, geoError, { enableHighAccuracy: true });
    	
        // var geo = new Ext.util.Geolocation({
		    // autoUpdate: true,
		    // allowHighAccuracy: true,
		    // listeners: {
		        // locationupdate: function(geo) {
		        	// // console.log('Accuracy:');
		        	// // console.log(geo);
	        		// lat = geo.getLatitude();
	            	// lon = geo.getLongitude();
// 	            	
	            	// // Ext.Viewport.setMasked({xtype: 'loadmask', message: lat + ' - ' + lon});	
// 		            
		            // var main_map = Ext.getCmp('main-map');
		            // main_map.userMarker.setPosition(new google.maps.LatLng(lat, lon));
// 		            
		            // main_map.setMapCenter({latitude: lat, longitude: lon});
// 		            
		            // Ext.data.StoreManager.lookup('Salepoints').sort();
		            // Ext.data.StoreManager.lookup('Salepoints').filter();
// 		            
		            // var markers = main_map.markers;
		            // for (var i=0; i<markers.length; i++) {
		            	// markers[i].setMap(null);
		            // }
		            // markers = [];
		            // var salepoints = Ext.data.StoreManager.lookup('Salepoints').getData().items;
		            // for (var i=0; i<salepoints.length; i++) {
		            	// if (i > 9) break;
		            	// var st_coords = stringToCoords(salepoints[i].data.coords);
		            	// var st_marker = new google.maps.Marker({
		            		// map: main_map.getMap(),
		            		// position: new google.maps.LatLng(st_coords.lat, st_coords.lon),
		            		// icon: salepoints[i].data.type == 'fuel' ? 'st_marker.png' : 'grocery.png',
		            		// text: salepoints[i].data.name + '<br />' + salepoints[i].data.address
		            	// });
		            	// markers.push(st_marker);
		            	// google.maps.event.addListener(markers[markers.length-1], 'click', function() {
		            		// main_map.info.setContent(this.text);
		            		// main_map.info.open(main_map.getMap(), this);
		            	// });
		            // }
		            // main_map.markers = markers;
		        // },
		        // locationerror: function(geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
		            // if(bTimeout){
		                // alert('Timeout occurred.');
		            // } else {
		                // alert('Error occurred.');
		            // }
		        // }
		    // }
		// });
    }
});