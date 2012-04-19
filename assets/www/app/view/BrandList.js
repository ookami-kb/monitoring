Ext.define('Monitoring.view.BrandList', {
    extend: 'Ext.dataview.List',
    
    config: {
    	title: 'Бренды',
	    id: 'br-list',
	    xtype: 'list',
	    itemTpl: '{name}',
	    store: 'Brands',
	    listeners: {
	    	select: function(list, record, opts) {
		    	var v = Ext.getCmp('main-view');
		    	v.selectedWBID = record.get('ext_id');

		    	// var store = Ext.StoreManager.get('Offers');
// 		    	
// 		    	
		    	// store.setFilters({filterFn: function(item) {
		    		// if (item.get('whitebrand_id') == v.selectedWBID &&
		    			// item.get('salepoint_id') == v.selectedSPid) {return true;}
		    		// return false;
		    	// }});
		    	// store.filter();
		    	// store.sort();
		    	var query = 'select * from offers_tables WHERE whitebrand_id = ' + v.selectedWBID + ' and salepoint_id = ' + v.selectedSPid;
		    	console.log(query);
		    	offersStore.load({
		    		query : query
	    		});
	    		console.log('selected');
		    	
		    	var products = Ext.create('Monitoring.view.ProductList', {
		    		title: record.get('name')
	    		});
	    		console.log('created');
		    	
		    	v.push(products);
		    	console.log('pushed');
		    	// list.deselectAll();
		    }
	    }
    }
});