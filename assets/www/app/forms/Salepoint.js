Ext.define('Monitoring.forms.Salepoint', {
	extend: 'Ext.form.Panel',
	requires: ['Ext.field.Select'],
	
	config: {
		title: 'Торговая точка',
		id: 'salepoint-form',
		items: [
			{
				xtype: 'textfield',
				name: 'name',
				label: 'Название'
			},
			{
				xtype: 'textfield',
				name: 'address',
				label: 'Адрес'
			},
			{
				xtype: 'selectfield',
				name: 'type',
				label: 'Тип',
				options: [{
					text: 'продукты',
					value: 'product'
				},
				{
					text: 'топливо',
					value: 'fuel'
				}]
			},
			{
				xtype: 'textfield',
				name: 'coords',
				label: 'Координаты',
				disabled: true
			},
			{
				xtype: 'button',
				text: 'На карте',
				handler: function() {
					var coords = this.up('formpanel').getValues().coords;
					var sp_type = this.up('formpanel').getValues().type;
					var m = Ext.create('Monitoring.view.SalepointMap', {coords: coords, sp_type: sp_type});
					Ext.getCmp('main-view').push(m);
				}
			},
			{
				xtype: 'textfield',
				name: 'ext_id',
				label: 'ID',
				disabled: true,
			},
			{
				xtype: 'button',
				text: 'Сохранить',
				ui: 'confirm',
				handler: function() {
					var record = this.up('formpanel').getRecord();
					if (!record) {
						var store = Ext.StoreManager.get('Salepoints');
						var data = this.up('formpanel').getValues();
						data.is_new = true;
						store.add(data);
						store.sync();
					} else {
						record.set(this.up('formpanel').getValues());
						record.save();
					}
					Ext.getCmp('main-view').pop();
				}
			},
			{
				xtype: 'button',
				text: 'Удалить',
				ui: 'decline',
				handler: function() {
					var f = this;
					var record = f.up('formpanel').getRecord();
					if (!record) return;
					Ext.Msg.confirm('Подтверждение', 'Удалить торговую точку?', function(btn) {
						if (btn == 'yes') {
							var store = Ext.StoreManager.get('Salepoints');
							store.remove(record);
							store.sync();
							Ext.getCmp('main-view').pop();
						}
					});
				}
			}
		]
	}
});
