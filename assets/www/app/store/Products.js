Ext.define('Monitoring.store.Products', {
	extend: 'Ext.data.Store',
	config: {
		model: 'Monitoring.model.Product',
	    proxy: {
	        type: 'localstorage',
	        id: 'products'
	    },
	    autoLoad: true,
	    sorters: [{
	    	sorterFn: function(r1, r2) {
	    		var get_price = function(source_code, source_type) {
		    		var v = Ext.getCmp('main-view');
		    		var store = Ext.StoreManager.get('Offers');
		    		if (!store) return 0;
		    		var offer_id = store.findBy(function(inner_record, inner_id) {
			    		if (inner_record.get('source_code') == source_code &&
			    			inner_record.get('source_type') == source_type &&
			    			inner_record.get('salepoint_id') == v.selectedSPid) return true;
		    			return false;
			    	});
			    	if (offer_id == -1) {return -1;} else {
			    		var offer = store.getAt(offer_id);
			    		if (offer.get('modified')) return false;
			    		return offer.get('price');
			    	}
		    	};
		    	return get_price(r1.get('source_code'), r1.get('source_type')) > 
		    		get_price(r2.get('source_code'), r2.get('source_type')) ? 1 : 
		    		(get_price(r1.get('source_code'), r1.get('source_type')) == 
		    			get_price(r2.get('source_code'), r2.get('source_type')) ? 0 : -1);
		    },
		    direction: 'DESC'
	    }]
	}
});