Ext.define('Monitoring.view.ProductList', {
    extend: 'Ext.dataview.List',
    
    config: {
    	title: 'Продукты',
	    id: 'pr-list',
	    xtype: 'list',
	    itemTpl: new Ext.XTemplate('<p style="position: relative; {[this.ofPrice(values.source_code, values.source_type) ? "color: black;" : ( values.is_new ? "color: green;" : "color: #666;")]}"><span style="display: inline-block; width: 70%;">{title} {title_extra} ' + 
	    	'{manufacturer} </span><span style="display: inline-block; width: 30%;">{[this.ofPrice(values.source_code, values.source_type)]} руб.</span></p>',
	    {
	    	ofPrice: function(source_code, source_type) {
	    		// return 0;
	    		var v = Ext.getCmp('main-view');
	    		var store = Ext.StoreManager.get('Offers');
	    		var offer_id = store.findBy(function(inner_record, inner_id) {
		    		if (inner_record.get('source_code') == source_code &&
		    			inner_record.get('source_type') == source_type &&
		    			inner_record.get('salepoint_id') == v.selectedSPid) return true;
	    			return false;
		    	});
		    	if (offer_id == -1) {return 0;} else {
		    		var offer = store.getAt(offer_id);
		    		return offer.get('price');
		    	}
	    	}
	    }),
	    store: 'Products',
	    listeners: {
	    	select: function(list, record, opts) {
		    	var v = Ext.getCmp('main-view');
		    	
		    	var store = Ext.StoreManager.get('Offers');
		    	var offer_id = store.findBy(function(inner_record, id) {
		    		if (inner_record.get('source_code') == record.get('source_code') &&
		    			inner_record.get('source_type') == record.get('source_type') &&
		    			inner_record.get('salepoint_id') == v.selectedSPid) return true;
	    			return false;
		    	});
		    	
		    	var new_value = 0; // значения для формы изменения цены
		    	// новое предложение, если еще не было создано
		    	var new_offer = {
		    		salepoint_id: v.selectedSPid,
		    		source_code: record.get('source_code'),
		    		source_type: record.get('source_type'),
		    		// modified: true,
		    		timestamp: Date.now()
		    	};
		    	// если предложение уже есть, надо вытащить его, будем его изменять
		    	if (offer_id != -1) {
		    		new_offer = store.getAt(offer_id);
		    		new_value = new_offer.get('price');
		    	}
		    	// Вызываем окно для ввода новой цены
		    	Ext.Msg.prompt(
			        'Введите цену',
			        'Для удаления предложения введите пустое значение',
			        function(buttonId, value) {
			        	if (buttonId == 'cancel') return;
			            if (buttonId == 'ok') {
			            	// сохраняем или добавляем предложение
			            	if (offer_id == -1) {
			            		if (value == '') return;
			            		new_offer.price = value;
			            		store.add(new_offer);
			            	} else {
			            		if (value == '') {
			            			store.removeAt(offer_id);
			            		} else {
				            		new_offer.set('price', value);
				            		// new_offer.set('modified', true);
				            		new_offer.set('timestamp', Date.now());
				            	}
			            	}
			            	store.sync();
			            	Ext.StoreManager.get('Products').sort();
			            }
			        },
			        null,
			        false,
			        new_value
			        // {xtype: 'numberfield'}
			    );
		    	
		    	list.deselectAll();
		    },
		    itemswipe: function(dataview, index, target, record, e, eOpts) {
	    		if (!record.get('is_new')) return;
	    		// var form = Ext.create('Monitoring.forms.Product', {record: record});
		    	// Ext.getCmp('main-view').push(form);
		    	Ext.Msg.prompt(
			        'Редактирование продукта',
			        'Введите сведения о продукте',
			        function(buttonId, value) {
			        	if (buttonId == 'cancel') return;
			            if (buttonId == 'ok') {
			            	record.set({title: value});
							record.save();
							Ext.StoreManager.get('Products').sync();
			            }
			        },
			        null,
			        false,
			        record.get('title')
			    );
	    	}
	    }
    }
});