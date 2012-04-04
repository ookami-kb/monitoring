Ext.define('Monitoring.store.Offers', {
	extend: 'Ext.data.Store',
	config: {
		model: 'Monitoring.model.Offer',
	    proxy: {
	        type: 'localstorage',
	        id: 'offers'
	    },
	    autoLoad: true
	}
});