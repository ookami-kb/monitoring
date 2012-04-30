function onPhotoSuccess(imageURI) {
	Ext.Msg.alert('Photo', imageURI);
}

function onPhotoFail(message) {
	Ext.Msg.alert('Photo', message);
}

// Главная вьюха, к которой будут добавляться все списки
Ext.define('Monitoring.view.Main', {
    extend: 'Ext.navigation.View',
    selectedSPID: null,
    selectedWBID: null,
    
    config: {
    	title: 'Поиск',
    	id: 'main-view',
		iconCls: 'search',
    	items: [],
	    listeners: {
	    	activeitemchange: function(view, value, old, opts) {
	    		if (value.getId() == 'salepoint-map') {
	    			view.getNavigationBar().rightBox.add({
			    		xtype: 'button',
			    		id: 'confirm-salepoint-position',
			    		ui: 'plain',
			    		iconMask: true,
			    		iconCls: 'action',
			    		handler: function() {
			    			var m = Ext.getCmp('salepoint-map');
			    			var s_lat = m.marker.position.lat();
			    			var s_lon = m.marker.position.lng();
			    			Ext.getCmp('main-view').pop();
			    			Ext.getCmp('salepoint-form').setValues({coords: s_lat + ',' + s_lon});
			    		}
					});
	    		} else {
	    			var b = Ext.getCmp('confirm-salepoint-position');
	    			if (b) b.destroy();
	    		}
	    		if (value.getId() == 'sp-list') {
	    			view.getNavigationBar().leftBox.add({
			    		xtype: 'button',
			    		id: 'geo-btn',
			    		ui: 'plain',
			    		iconMask: true,
			    		iconCls: 'maps',
			    		handler: function() {
			    			if (geo) {
			    				navigator.geolocation.clearWatch(geo);
			    				geo = null;
			    			} else {
			    				geo = navigator.geolocation.watchPosition(geoSuccess, geoError, { enableHighAccuracy: true });
			    			}
					    }
				    }
				    // {
				    	// xtype: 'button',
			    		// id: 'photo-btn',
			    		// ui: 'plain',
			    		// iconMask: true,
			    		// iconCls: 'photo1',
			    		// handler: function() {
			    			// Ext.Msg.alert('Photo', 'Taking Photo');
			    			// navigator.camera.getPicture(onPhotoSuccess, onPhotoFail, { 
			    				// quality: 50, 
			    				// destinationType: Camera.DestinationType.FILE_URI 
		    				// }); 
					    // }
				    // }
				    );
	    			// view.getNavigationBar().rightBox.add({
			    		// xtype: 'button',
			    		// id: 'add-salepoint-btn',
			    		// ui: 'plain',
			    		// iconMask: true,
			    		// iconCls: 'add',
			    		// handler: function() {
			    			// var form = Ext.create('Monitoring.forms.Salepoint');
			    			// form.setValues({
			    				// ext_id: Date.now(),
			    				// coords: coordsToString(lat, lon)
		    				// });
			    			// view.push(form);
			    		// }
			    	// });
	    		} else {
	    			var b = Ext.getCmp('add-salepoint-btn');
	    			var c = Ext.getCmp('geo-btn');
	    			if (b) b.destroy();
	    			if (c) c.destroy();
	    		}
	    		// if (value.getId() == 'pr-list') {
	    			// view.getNavigationBar().rightBox.add({
			    		// xtype: 'button',
			    		// id: 'add-product-btn',
			    		// ui: 'plain',
			    		// iconMask: true,
			    		// iconCls: 'add',
			    		// handler: function() {
			    			// Ext.Msg.prompt(
						        // 'Новый продукт',
						        // 'Введите сведения о продукте',
						        // function(buttonId, value) {
						        	// if (buttonId == 'cancel') return;
						            // if (buttonId == 'ok' && value) {
						            	// var store = Ext.StoreManager.get('Offers');
						            	// var salepoints = Ext.data.StoreManager.lookup('Salepoints');
						            	// salepoints.setFilters({filterFn: function(item) {return true;}});
										// salepoints.filter();
										// var source_code = Date.now();
										// salepoints.each(function(salepoint) {
											// var data = {
												// is_new: true,
												// title: value,
												// source_code: source_code,
												// whitebrand_id: view.selectedWBID,
												// salepoint_id: salepoint.get('ext_id'),
												// source_type: 'neiron',
												// price: null
											// };
											// store.add(data);
										// });
										// store.sync();
						            // }
						        // },
						        // null,
						        // false,
						        // ''
						    // );
			    		// }
			    	// });
	    		// } else {
	    			// var b = Ext.getCmp('add-product-btn');
	    			// if (b) b.destroy();
	    		// }
	    	}
	    }
    }

    
});