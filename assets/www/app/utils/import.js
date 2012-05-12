var generatorURL = 'http://upload.v-zabote.ru';

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
					if (oXHR.status != 202) {
						Ext.Viewport.setMasked(false);
						Ext.Msg.alert('Ошибка', oXHR.status + ': ' + oXHR.statusText);
					} else {
						_truncateSalepoints();
					}
			  	}
		 	};	
			oXHR.open("PATCH", generatorURL + '/api/v1/offer/?username='+ username +'&password='+ password,true);
			oXHR.setRequestHeader("Content-type","application/json");
			oXHR.send(to_export);
		}
	});
	
}

function _truncateProducts() {
	Ext.Viewport.setMasked({xtype: 'loadmask', message: 'Удаление предложений'});
	offersStore.getProxy().truncate(function() {
		importSalepoints();
	});
}

function importProducts(url, offset, total) {
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
		failure: function(result) {
			Ext.Viewport.setMasked(false);
			Ext.Msg.alert('Ошибка', 'Импорт продуктов: ' + result);
		},
		success: function(result) {
			var salepoints = salepointsStore.load();
			
			var db = openDatabase('monitoring', '1.19', 'monitoring', 2 * 1024 * 1024);
			db.transaction(function (tx) {
			  	for (var i=0; i<result.objects.length; i++) {
					var data = result.objects[i];
					salepoints.each(function(salepoint) {
						tx.executeSql('INSERT INTO offers_tables (title, whitebrand_id, source_code, source_type, is_new, salepoint_id, price, sort_weight) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
							[data.title+(data.manufacturer ? '. ' + data.manufacturer : '')+(data.title_extra ? '. ' + data.title_extra : ''),
							data.whitebrand_id, data.source_code.toString(), data.source_type,
							false, salepoint.get('ext_id'), null, data.sort_weight]);
					});
				}
			  
			}, function(tx, error) {
				Ext.Msg.alert('Ошибка', tx.message);
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
	Ext.Viewport.setMasked({xtype: 'loadmask', message: 'Удаление брендов'});
	brandsStore.getProxy().truncate(function() {
		_truncateProducts();
	});
}

function importBrands() {
	Ext.Viewport.setMasked({xtype: 'loadmask', message: 'Импорт брендов'});
	Ext.data.JsonP.request({
		url: generatorURL + '/api/v1/whitebrand/',
		callbackKey: 'callback',
		params: {
			format: 'jsonp',
			username: username,
			password: password,
			limit: 0
		},
		failure: function(result) {
			Ext.Viewport.setMasked(false);
			Ext.Msg.alert('Ошибка', 'Импорт брендов: ' + result);
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
	Ext.Viewport.setMasked({xtype: 'loadmask', message: 'Удаление магазинов'});
	salepointsStore.getProxy().truncate(function() {
		_truncateBrands();
	});
}

function importSalepoints(url, offset, total) {
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
		failure: function(result) {
			Ext.Viewport.setMasked(false);
			Ext.Msg.alert('Ошибка', 'Импорт магазинов: ' + result);
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
