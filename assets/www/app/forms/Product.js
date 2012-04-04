Ext.define('Monitoring.forms.Product', {
	extend: 'Ext.form.Panel',
	
	config: {
		title: 'Продукт',
		id: 'product-form',
		items: [
			{
				xtype: 'textfield',
				name: 'title',
				label: 'Название'
			},
			{
				xtype: 'textfield',
				name: 'whitebrand_id',
				label: 'ID',
				disabled: true,
			},
			{
				xtype: 'textfield',
				name: 'source_code',
				label: 'SC',
				disabled: true,
			},
			{
				xtype: 'textfield',
				name: 'source_type',
				label: 'ST',
				disabled: true,
			},
			{
				xtype: 'button',
				text: 'Сохранить',
				ui: 'confirm',
				handler: function() {
					var record = this.up('formpanel').getRecord();
					if (!record) {
						var store = Ext.StoreManager.get('Products');
						var data = this.up('formpanel').getValues();
						data.is_new = true;
						data.title_extra = '';
						data.manufacturer = '';
						store.add(data);
						store.sync();
					} else {
						record.set(this.up('formpanel').getValues());
						record.save();
						Ext.StoreManager.get('Products').sync();
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
					Ext.Msg.confirm('Подтверждение', 'Удалить продукт?', function(btn) {
						if (btn == 'yes') {
							var store = Ext.StoreManager.get('Products');
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
