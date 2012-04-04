Ext.define('Monitoring.store.Brands', {
	extend: 'Ext.data.Store',
	config: {
		model: 'Monitoring.model.Brand',
	    proxy: {
	        type: 'localstorage',
	        id: 'brands'
	    },
	    autoLoad: true,
	    sorters: 'name' 	
	}
});