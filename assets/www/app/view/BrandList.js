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
		    	
		    	var store = Ext.StoreManager.get('Products');
		    	
		    	
		    	store.setFilters({property: 'whitebrand_id', value: record.get('ext_id'), exactMatch: true});
		    	store.filter();
		    	store.sort();
		    	
		    	var products = Ext.create('Monitoring.view.ProductList', {title: record.get('name')});
		    	
		    	v.push(products);
		    	list.deselectAll();
		    }
	    }
    }
});