var generatorURL = 'http://upload.v-zabote.ru';

function exportProducts() {
	console.log('Export products - start');
	Ext.Viewport.setMasked({xtype: 'loadmask', message: 'Экспорт продуктов'});
	var salepoints = Ext.data.StoreManager.lookup('Products');
	var filters = salepoints.getFilters();
	salepoints.setFilters({property: 'is_new', value: true});
	salepoints.filter();
	var data = [];
	salepoints.each(function(salepoint) {
		data.push({
			title: salepoint.get('title'),
			white_brand: salepoint.get('whitebrand_id'),
			source_code: salepoint.get('source_code'),
			source_type: salepoint.get('source_type'),
			username: username
		});
	});
	salepoints.setFilters(filters);
	salepoints.load();
	// console.log(data);
	// return;
	var to_export = JSON.stringify({objects: data});
	// console.log(to_export);
	// return;
	var oXHR = new XMLHttpRequest();
	oXHR.onreadystatechange = function (aEvt) {
		if (oXHR.readyState == 4) {
			console.log('Export products - end');
	  		exportOffers();
	  	}
 	};	
	oXHR.open("PATCH", generatorURL + '/api/v1/product/?username='+ username +'&password='+ password,true);
	oXHR.setRequestHeader("Content-type","application/json");
	oXHR.send(to_export);
	return;
}

function exportSalepoints() {
	console.log('Export salepoints - start');
	Ext.Viewport.setMasked({xtype: 'loadmask', message: 'Экспорт торговых точек'});
	var salepoints = Ext.data.StoreManager.lookup('Salepoints');
	var filters = salepoints.getFilters();
	salepoints.setFilters({property: 'is_new', value: true});
	salepoints.filter();
	var data = [];
	salepoints.each(function(salepoint) {
		data.push({
			name: salepoint.get('name'),
			address: salepoint.get('address'),
			coords: salepoint.get('coords'),
			salepoint_id: salepoint.get('ext_id'),
			username: username,
			variation: salepoint.get('type')
		});
	});
	salepoints.setFilters(filters);
	salepoints.load();
	var to_export = JSON.stringify({objects: data});
	var oXHR = new XMLHttpRequest();
	oXHR.onreadystatechange = function (aEvt) {
		if (oXHR.readyState == 4) {
			console.log('Export salepoints - end');
	  		exportOffers();
	  	}
 	};	
	oXHR.open("PATCH", generatorURL + '/api/v1/salepoint/?username='+ username +'&password='+ password,true);
	oXHR.setRequestHeader("Content-type","application/json");
	oXHR.send(to_export);
	return;
}

function exportOffers() {
	console.log('Export offers - start');
	Ext.Viewport.setMasked({xtype: 'loadmask', message: 'Экспорт предложений'});
	var offers = Ext.data.StoreManager.lookup('Offers');
	var filters = offers.getFilters();
	offers.setFilters({filterFn: function(item) {return item.get('price') ? true : false;}});
	offers.filter();
	var data = [];
	offers.each(function(offer) {
		data.push({
			source_code: offer.get('source_code'),
			source_type: offer.get('source_type'),
			salepoint_id: offer.get('salepoint_id'),
			price: offer.get('price'),
			title: offer.get('title'),
			white_brand: offer.get('whitebrand_id'),
			username: username
		});
	});
	var to_export = JSON.stringify({objects: data});
	var oXHR = new XMLHttpRequest();
	oXHR.onreadystatechange = function (aEvt) {
		if (oXHR.readyState == 4) {
			offers.setFilters({filterFn: function() {return true;}});
			offers.removeAll();
			offers.sync();
			offers.setFilters(filters);
			offers.filter();
			console.log('Export offers - end');
	  		importSalepoints();
	  	}
 	};	
	oXHR.open("PATCH", generatorURL + '/api/v1/offer/?username='+ username +'&password='+ password,true);
	oXHR.setRequestHeader("Content-type","application/json");
	oXHR.send(to_export);
	return;
}

function importProducts(url, offset, total) {
	if (!url) console.log('Import products - start');
	var message = offset && total ? 'Импорт продуктов: ' + offset + ' из ' + total : 'Импорт продуктов';
	Ext.Viewport.setMasked({xtype: 'loadmask', message: message});
	Ext.data.JsonP.request({
		url: url ? url : generatorURL + '/api/v1/product/?limit=20',
		// url: url ? url : generatorURL + '/api/v1/fuel_product/?limit=5',
		callbackKey: 'callback',
		params: {
			format: 'jsonp',
			username: username,
			password: password
		},
		failure: function() {
			Ext.Viewport.setMasked(false);
			Ext.Msg.alert('Ошибка', 'Импорт не удался');
		},
		success: function(result) {
			console.log('Process products - start');
			// var offers = Ext.data.StoreManager.lookup('Offers');
			// var filters = offers.getFilters();
			
			var salepoints = Ext.data.StoreManager.lookup('Salepoints');
			
			if (!url) {
				// offers.setFilters({filterFn: function(item) {return true;}});
				// offers.filter();
				// offers.removeAll();
				offersStore.getProxy().truncate();
				salepoints.setFilters({filterFn: function(item) {return true;}});
				salepoints.filter();
			}
			
			
			for (var i=0; i<result.objects.length; i++) {
				var data = result.objects[i];
				salepoints.each(function(salepoint) {
					var new_offer = {
						title: data.title+(data.manufacturer ? '. ' + data.manufacturer : '')+(data.title_extra ? '. ' + data.title_extra : ''),
						whitebrand_id: data.whitebrand_id,
						source_code: data.source_code,
						source_type: data.source_type,
						is_new: 0,
						salepoint_id: salepoint.get('ext_id'),
						price: null
					}
					var rec = Ext.create('Monitoring.model.Offer', new_offer);
					// console.log(rec);
					rec.save();
					// offers.add(new_offer);
				});
			}
			// offers.sync();
			offersStore.load();
			// offers.setFilters(filters);
			// offers.filter();
			console.log('Process products - end');
			if (result.meta.next == null) {
				console.log('Import products - end');
				Ext.Viewport.setMasked(false);
				Ext.Msg.alert('Информация', 'Импорт успешно завершен');
				Ext.getCmp('main-view').pop(10);
			} else {
				importProducts(generatorURL + result.meta.next, result.meta.offset + result.meta.limit, result.meta.total_count);
			}
		}
	});
}

function importBrands() {
	console.log('Import brands - start');
	Ext.Viewport.setMasked({xtype: 'loadmask', message: 'Импорт брендов'});
	Ext.data.JsonP.request({
		url: generatorURL + '/api/v1/whitebrand/',
		callbackKey: 'callback',
		params: {
			format: 'jsonp',
			username: username,
			password: password,
			limit: 30
		},
		failure: function() {
			Ext.Viewport.setMasked(false);
			Ext.Msg.alert('Ошибка', 'Импорт не удался');
		},
		success: function(result) {
			var brands = Ext.data.StoreManager.lookup('Brands');
			brands.removeAll();
			
			// перебираем все бренды и добавляем их в store
			for (var i=0; i<result.objects.length; i++) {
				var data = result.objects[i];
				var obj = {
					name: data.name,
					ext_id: data.ext_id
				}
				brands.add(obj)[0];
			}
			brands.sync();
			console.log('Import brands - end');
			importProducts();
		}
	});
}

function importSalepoints(url, offset, total) {
	console.log('Import salepoints - start');
	var message = offset && total ? 'Импорт магазинов: ' + offset + ' из ' + total : 'Импорт магазинов';
	Ext.Viewport.setMasked({xtype: 'loadmask', message: message});
	Ext.data.JsonP.request({
		url: url ? url : generatorURL + '/api/v1/salepoint/?limit=20',
		callbackKey: 'callback',
		params: {
			format: 'jsonp',
			username: username,
			password: password
		},
		failure: function() {
			Ext.Viewport.setMasked(false);
			Ext.Msg.alert('Ошибка', 'Импорт не удался');
		},
		success: function(result) {
			var salepoints = Ext.data.StoreManager.lookup('Salepoints');
			if (!url) {
				salepoints.setFilters({filterFn: function(item) {return true;}});
				salepoints.filter();
				salepoints.removeAll();
			}
			
			// перебираем все магазины и добавляем их в store
			for (var i=0; i<result.objects.length; i++) {
				var data = result.objects[i];
				var obj = {
					name: data.name,
					address: data.address,
					coords: data.coords,
					// type: data.type,
					type: data.variation,
					ext_id: data.id
				}
				salepoints.add(obj)[0];
			}
			salepoints.sync();
			
			if (result.meta.next == null) {
				console.log('Import salepoints - end');
				importBrands();
			} else {
				importSalepoints(generatorURL + result.meta.next, result.meta.offset + result.meta.limit, result.meta.total_count);
			}
		}
	});
}
