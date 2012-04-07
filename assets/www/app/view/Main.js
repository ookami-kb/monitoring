// Главная вьюха, к которой будут добавляться все списки
Ext.define('Monitoring.view.Main', {
    extend: 'Ext.navigation.View',
    // requires: ['Monitoring.forms.Station', 'Monitoring.forms.Offer'],
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
	    			view.getNavigationBar().rightBox.add({
			    		xtype: 'button',
			    		id: 'add-salepoint-btn',
			    		ui: 'plain',
			    		iconMask: true,
			    		iconCls: 'add',
			    		handler: function() {
			    			var form = Ext.create('Monitoring.forms.Salepoint');
			    			form.setValues({
			    				ext_id: Date.now(),
			    				coords: coordsToString(lat, lon)
		    				});
			    			view.push(form);
			    		}
			    	});
	    		} else {
	    			var b = Ext.getCmp('add-salepoint-btn');
	    			if (b) b.destroy();
	    		}
	    		if (value.getId() == 'pr-list') {
	    			view.getNavigationBar().rightBox.add({
			    		xtype: 'button',
			    		id: 'add-product-btn',
			    		ui: 'plain',
			    		iconMask: true,
			    		iconCls: 'add',
			    		handler: function() {
			    			// var form = Ext.create('Monitoring.forms.Product');
			    			// form.setValues({
			    				// source_code: Date.now(), 
			    				// whitebrand_id: view.selectedWBID,
			    				// source_type: 'FTP'
		    				// });
			    			// view.push(form);
			    			Ext.Msg.prompt(
						        'Новый продукт',
						        'Введите сведения о продукте',
						        function(buttonId, value) {
						        	if (buttonId == 'cancel') return;
						            if (buttonId == 'ok' && value) {
						            	var store = Ext.StoreManager.get('Offers');
						            	var salepoints = Ext.data.StoreManager.lookup('Salepoints');
						            	salepoints.setFilters({filterFn: function(item) {return true;}});
										salepoints.filter();
										var source_code = Date.now();
										salepoints.each(function(salepoint) {
											var data = {
												is_new: true,
												title: value,
												source_code: source_code,
												whitebrand_id: view.selectedWBID,
												salepoint_id: salepoint.get('ext_id'),
												source_type: 'agents',
												price: null
											};
											store.add(data);
										});
										store.sync();
						            }
						        },
						        null,
						        false,
						        ''
						    );
			    		}
			    	});
	    		} else {
	    			var b = Ext.getCmp('add-product-btn');
	    			if (b) b.destroy();
	    		}
	    	}
	    	// activeitemchange: function(view, value, old, opts) {
	    		// Ext.get('add-station-btn').hide();
	    		// Ext.get('add-offer-btn').hide();
	    		// Ext.get('confirm-station-position').hide();
	    		// if (value.getId() == 'st-list') {
	    			// Ext.get('add-station-btn').show();
	    		// }
	    		// if (value.getId() == 'of-list') {
	    			// Ext.get('add-offer-btn').show();
	    		// }
	    		// if (value.getId() == 'station-map') {
	    			// Ext.get('confirm-station-position').show();
	    		// }
	    	// }
	    }
    }

    
});