// Список торговых точек
Ext.define('Monitoring.view.Salepoints', {
	extend: 'Ext.List',
	config: {
        title: 'Торговые точки',
        id: 'sp-list',
	    xtype: 'list',
	    // itemTpl: '{name}. {address}',
	    itemTpl: new Ext.XTemplate('<p style="color: {[values.is_new ? "green" : "black"]}">{name}. {address}</p>'),
	    store: 'Salepoints',
	    // onItemDisclosure: function(record) {
	    	// var form = Ext.create('MyApp.forms.Station', {record: record});
	    	// Ext.getCmp('stations-view').push(form);
	    // },
	    listeners: {
	    	select: function(list, record, options) {
	    		// console.log(record.get('type'));
	    		var v = Ext.getCmp('main-view');
	    		// Запоминаем выбранную точку продаж
    			v.selectedSPid = record.get('ext_id');
	    		
	    		// для продуктовых ТТ выводим список белых брендов
	    		if (record.get('type') == 'product') {
	    			var l = Ext.create('Monitoring.view.BrandList', {title: record.get('name')});	
	    		} else {
	    			v.selectedWBID = 0;
		    	
			    	var store = Ext.StoreManager.get('Products');
			    	
			    	store.setFilters({property: 'whitebrand_id', value: 0, exactMatch: true});
			    	store.filter();
			    	store.sort();
			    	
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
