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
	    // listeners: {
		    // itemswipe: function(dataview, index, target, record, e, eOpts) {
	    		// if (!record.get('is_new')) return;
		    	// Ext.Msg.prompt(
			        // 'Редактирование продукта',
			        // 'Введите сведения о продукте',
			        // function(buttonId, value) {
			        	// if (buttonId == 'cancel') return;
			            // if (buttonId == 'ok') {
			            	// var offers = Ext.data.StoreManager.lookup('Offers');
							// var filters = offers.getFilters();
							// offers.setFilters({filterFn: function(item) {return item.get('source_code') == record.get('source_code')}});
							// offers.filter();
			            	// if (!value) {
// 								
								// var x = offers.getData().items.slice();
								// offers.remove(x);
								// offers.sync();
// 								
								// offers.setFilters(filters);
								// offers.filter();
								// return;
			            	// }
			            	// offers.each(function(offer) {offer.set('title', value)});
			            	// offers.sync();
			            	// offers.setFilters(filters);
							// offers.filter();
			            	// // record.set({title: value});
							// // record.save();
							// // Ext.StoreManager.get('Offers').sync();
			            // }
			        // },
			        // null,
			        // false,
			        // record.get('title')
			    // );
	    	// }
	    // }
    }
});