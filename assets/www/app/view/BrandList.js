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

		    	var query = 'select * from offers_tables WHERE whitebrand_id = ' + v.selectedWBID + ' and salepoint_id = ' + v.selectedSPid;
		    	console.log(query);
		    	offersStore.load({
		    		query : query
	    		});
		    	
		    	var products = Ext.create('Monitoring.view.ProductList', {
		    		title: record.get('name')
	    		});
		    	
		    	v.push(products);
		    }
	    }
    }
});