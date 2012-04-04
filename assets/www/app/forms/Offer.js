Ext.define('MyApp.forms.Offer', {
	extend: 'Ext.form.Panel',
	requires: ['Ext.field.Select'],
	
	config: {
		id: 'offer-form',
		title: 'Предложение',
		items: [{
			xtype: 'selectfield',
			name: 'name',
			label: 'Наименование',
			options: [{
				text: 'АИ-92',
				value: 'АИ-92'
			},
			{
				text: 'АИ-95',
				value: 'АИ-95'
			},
			{
				text: 'АИ-98',
				value: 'АИ-98'
			},
			{
				text: 'АИ-80',
				value: 'АИ-80'
			},
			{
				text: 'ДТ',
				value: 'ДТ'
			}]
		},
		{
			xtype: 'textfield',
			name: 'volume',
			label: 'Объем',
			value: '1'
		},
		{
			xtype: 'textfield',
			name: 'price',
			label: 'Цена'
		},
		{
			xtype: 'textfield',
			name: 'salepoint_id',
			label: 'Station',
			disabled: true
		},
		{
			xtype: 'button',
			text: 'Сохранить',
			ui: 'confirm',
			handler: function() {
				var record = this.up('formpanel').getRecord();
				var store = Ext.StoreManager.get('Offers');
				if (!record) {
					// при сохранении нового предложения подставляем значение
					// source_code и source_type 
					var data = this.up('formpanel').getValues();
					switch(data.name) {
						case 'АИ-92':
							data.source_code = 1;
							break;
						case 'АИ-95':
							data.source_code = 2;
							break;
						case 'АИ-98':
							data.source_code = 3;
							break;
						case 'АИ-80':
							data.source_code = 4;
							break;
						case 'ДТ':
							data.source_code = 5;
							break;
					}
					data.source_type = 'neiron';
					store.add(data);
					store.sync();
				} else {
					record.set(this.up('formpanel').getValues());
					record.save();
					store.sync();
				}
				Ext.getCmp('stations-view').pop();
			}
		},
		{
			xtype: 'button',
			text: 'Удалить',
			ui: 'decline',
			handler: function() {
				var f = this;
				Ext.Msg.confirm('Подтверждение', 'Удалить предложение?', function(btn) {
					if (btn == 'yes') {
						var record = f.up('formpanel').getRecord();
						var store = Ext.StoreManager.get('Offers');
						store.remove(record);
						store.sync();
						Ext.getCmp('of-list').refresh();
						Ext.getCmp('stations-view').pop();
					}
				});
			}
		}]
	}
});
