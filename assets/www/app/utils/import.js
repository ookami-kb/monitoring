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
	Ext.Viewport.setMasked({xtype: 'loadmask', message: 'Экспорт предложений'});
	var data = [];
	var offers = offersStore.load({
		query: "select * from offers_tables where price > 0",
		callback: function(items) {
			for (var i=0; i<items.length; i++) {
				var offer = items[i];
				data.push({
					source_code: offer.get('source_code'),
					source_type: offer.get('source_type'),
					salepoint_id: offer.get('salepoint_id'),
					price: offer.get('price'),
					title: offer.get('title'),
					white_brand: offer.get('whitebrand_id'),
					username: username
				});
			}
			var to_export = JSON.stringify({objects: data});
			var oXHR = new XMLHttpRequest();
			oXHR.onreadystatechange = function (aEvt) {
				if (oXHR.readyState == 4) {
			  		importSalepoints();
			  	}
		 	};	
			oXHR.open("PATCH", generatorURL + '/api/v1/offer/?username='+ username +'&password='+ password,true);
			oXHR.setRequestHeader("Content-type","application/json");
			oXHR.send(to_export);
		}
	});
	
}

function _truncateProducts() {
	offersStore.getProxy().truncate(function() {
		importProducts(generatorURL + '/api/v1/product/?limit=20');
	});
}

function importProducts(url, offset, total) {
	if (!url) {
		_truncateProducts();
		return;
	}
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
			var salepoints = salepointsStore.load();
			
			var db = openDatabase('monitoring', '1.19', 'monitoring', 2 * 1024 * 1024);
			db.transaction(function (tx) {
			  	for (var i=0; i<result.objects.length; i++) {
					var data = result.objects[i];
					salepoints.each(function(salepoint) {
						// var new_offer = {
							// title: data.title+(data.manufacturer ? '. ' + data.manufacturer : '')+(data.title_extra ? '. ' + data.title_extra : ''),
							// whitebrand_id: data.whitebrand_id,
							// source_code: data.source_code,
							// source_type: data.source_type,
							// is_new: 0,
							// salepoint_id: salepoint.get('ext_id'),
							// price: null
						// }
						tx.executeSql('INSERT INTO offers_tables (title, whitebrand_id, source_code, source_type, is_new, salepoint_id, price, sort_weight) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
							[data.title+(data.manufacturer ? '. ' + data.manufacturer : '')+(data.title_extra ? '. ' + data.title_extra : ''),
							data.whitebrand_id, data.source_code.toString(), data.source_type,
							false, salepoint.get('ext_id'), null, data.sort_weight]);
					});
				}
			  
			}, function(tx, error) {
				console.log(tx.message);
			});
			
			if (result.meta.next == null) {
				Ext.Viewport.setMasked(false);
				Ext.Msg.alert('Информация', 'Импорт успешно завершен');
				Ext.getCmp('main-view').pop(10);
			} else {
				importProducts(generatorURL + result.meta.next, result.meta.offset + result.meta.limit, result.meta.total_count);
			}
		}
	});
}

function _truncateBrands() {
	brandsStore.getProxy().truncate(function() {
		importBrands(true);
	});
}

function importBrands(truncated) {
	if (!truncated) {
		_truncateBrands();
		return;
	}
	
	Ext.Viewport.setMasked({xtype: 'loadmask', message: 'Импорт брендов'});
	Ext.data.JsonP.request({
		url: generatorURL + '/api/v1/whitebrand/',
		callbackKey: 'callback',
		params: {
			format: 'jsonp',
			username: username,
			password: password,
<<<<<<< HEAD
			limit: 30
=======
			limit: 0
>>>>>>> 85a99a50f530da65fbce63745011a4bf8c40b34e
		},
		failure: function() {
			Ext.Viewport.setMasked(false);
			Ext.Msg.alert('Ошибка', 'Импорт не удался');
		},
		success: function(result) {
			// перебираем все бренды и добавляем их в store
			for (var i=0; i<result.objects.length; i++) {
				var data = result.objects[i];
				var obj = {
					name: data.name,
					ext_id: data.ext_id
				}
				var rec = Ext.create('Monitoring.model.Brand', obj);
				rec.save();
			}
			importProducts();
		}
	});
}

function _truncateSalepoints() {
	salepointsStore.getProxy().truncate(function() {
		importSalepoints(generatorURL + '/api/v1/salepoint/?limit=20');
	});
}

function importSalepoints(url, offset, total) {
	if (!url) {
		_truncateSalepoints();
		return;
	}
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
				var rec = Ext.create('Monitoring.model.Salepoint', obj);
				rec.save();
			}
			
			if (result.meta.next == null) {
				importBrands();
			} else {
				importSalepoints(generatorURL + result.meta.next, result.meta.offset + result.meta.limit, result.meta.total_count);
			}
		}
	});
}
