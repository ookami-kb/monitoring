var lat = 0, lon = 0;
var geo = null;

var modelobj;
Ext.ns('DbConnection');

var dbconnval = {
	dbName: "monitoring",
	dbDescription: "testdb"
};

var offersStore, salepointsStore, brandsStore;

function geoSuccess(position) {
	lat = position.coords.latitude;
	lon = position.coords.longitude;
	
    var main_map = Ext.getCmp('main-map');
    main_map.userMarker.setPosition(new google.maps.LatLng(lat, lon));
    
    main_map.setMapCenter({latitude: lat, longitude: lon});
    
    // Ext.data.StoreManager.lookup('Salepoints').sort();
    // Ext.data.StoreManager.lookup('Salepoints').filter();
    
    var markers = main_map.markers;
    for (var i=0; i<markers.length; i++) {
    	markers[i].setMap(null);
    }
    markers = [];
    salepointsStore.each(function(salepoint) {
    	var st_coords = stringToCoords(salepoint.get('coords'));
    	var st_marker = new google.maps.Marker({
    		map: main_map.getMap(),
    		position: new google.maps.LatLng(st_coords.lat, st_coords.lon),
    		icon: salepoint.get('type') == 'fuel' ? 'st_marker.png' : 'grocery.png',
    		text: salepoint.get('name') + '<br />' + salepoint.get('address')
    	});
    	markers.push(st_marker);
    	google.maps.event.addListener(markers[markers.length-1], 'click', function() {
    		main_map.info.setContent(this.text);
    		main_map.info.open(main_map.getMap(), this);
    	});
    });
    main_map.markers = markers;
}

function geoError(error) {
	console.log(error);
}
// храним имя пользователя и пароль
var username = localStorage.getItem('stations_username');
var password = localStorage.getItem('stations_password');

Ext.application({
    name: 'Monitoring',
    
    requires: ['Ext.data.Store', 'Ext.navigation.View', 'Ext.dataview.List',
			   'Ext.form.Panel', 'Ext.util.GeoLocation', 'Ext.tab.Panel',
			   'Ext.data.JsonP', 'Ext.Map', 'Ext.data.proxy.LocalStorage',
			   'Ext.field.Password', 'Monitoring.forms.Sync', 
			   'Ext.data.reader.Array'],

    views: ['Main', 'MainMap', 'SalepointMap'],

    launch: function() {
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
		
		Ext.define('Monitoring.model.Salepoint', {
			extend: 'Ext.data.Model',
			config: {
				idProperty : 'uniqueid', // if we have field with name as id, conflicts happens with default idProperty(id) which always have value as ext-record-x
				clientIdProperty : 'id',
				fields: [
					{name: 'name', type: 'string'},
					{name: 'address', type: 'string'},
					{name: 'coords', type: 'string'},
					{name: 'type', type: 'string'},
					{name: 'ext_id', type: 'int'},
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
						tablename: 'salepoints_tables',
						dbConn: Ext.DbConnection
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
		
		salepointsStore = Ext.create('Ext.data.Store',{
			model  : 'Monitoring.model.Salepoint',
			autoLoad: true
		});
		
		Ext.define('Monitoring.model.Brand', {
		    extend: 'Ext.data.Model',
		    config: {
		    	idProperty : 'uniqueid', // if we have field with name as id, conflicts happens with default idProperty(id) which always have value as ext-record-x
				clientIdProperty : 'id',
		        fields: [
		        	{name: 'name', type: 'string'},
		        	{name: 'ext_id', type: 'int'},
		        	{
						name: 'id',
						type: 'int',
						fieldOption: 'PRIMARY KEY'
					}
		        ],
		        proxy: {
		        	type: 'sqlitestorage',
		        	dbConfig: {
						tablename: 'brands_tables',
						dbConn: Ext.DbConnection
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
		
		brandsStore = Ext.create('Ext.data.Store',{
			model  : 'Monitoring.model.Brand',
			autoLoad: true
		});
		
		Ext.define('Monitoring.view.BrandList', {
		    extend: 'Ext.dataview.List',
		    
		    config: {
		    	title: 'Бренды',
			    id: 'br-list',
			    xtype: 'list',
			    itemTpl: '{name}',
			    store: brandsStore,
			    listeners: {
			    	select: function(list, record, opts) {
			    		Ext.Viewport.setMasked({xtype: 'loadmask', message: 'Загрузка...'});
				    	var v = Ext.getCmp('main-view');
				    	v.selectedWBID = record.get('ext_id');
		
				    	var query = 'select * from offers_tables WHERE whitebrand_id = ' + v.selectedWBID + ' and salepoint_id = ' + v.selectedSPid + ' order by title';
				    	offersStore.load({
				    		query : query,
				    		callback: function(items) {
				    			console.log(items);
				    			var products = Ext.create('Monitoring.view.ProductList', {
						    		title: record.get('name')
					    		});
						    	
						    	Ext.Viewport.setMasked(false);
						    	v.push(products);
						    	list.deselectAll();
				    		}
			    		});
				    	
				    	
				    }
			    }
		    }
		});

		
		// Список торговых точек
		Ext.define('Monitoring.view.Salepoints', {
			extend: 'Ext.List',
			config: {
		        title: 'Торговые точки',
		        id: 'sp-list',
			    xtype: 'list',
			    itemTpl: new Ext.XTemplate('<p style="color: {[values.is_new ? "green" : "black"]}">{name}. {address}</p>'),
			    store: salepointsStore,
			    listeners: {
			    	select: function(list, record, options) {
			    		var v = Ext.getCmp('main-view');
			    		// Запоминаем выбранную точку продаж
		    			v.selectedSPid = record.get('ext_id');
			    		// для продуктовых ТТ выводим список белых брендов
			    		if (record.get('type') == 'product') {
			    			brandsStore.load({
			    				query: 'select * from brands_tables order by name'
			    			});
			    			var l = Ext.create('Monitoring.view.BrandList', {title: record.get('name')});	
			    		} else {
			    			v.selectedWBID = 0;
				    		var query = 'select * from offers_tables WHERE whitebrand_id = ' + v.selectedWBID + ' and salepoint_id = ' + v.selectedSPid + ' order by title';
					    	offersStore.load({
					    		query : query
				    		});
				    	
					    	var l = Ext.create('Monitoring.view.ProductList', {title: record.get('name')});
			    		}
		    			
		    			v.push(l);
			    		list.deselectAll();
			    	},
			    	itemswipe: function(dataview, index, target, record, e, eOpts) {
			    		if (!record.get('is_new')) return;
			    		var form = Ext.create('Monitoring.forms.Salepoint', {record: record});
				    	Ext.getCmp('main-view').push(form);
			    	}
			    }
		    }
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
    }
});