Ext.define('Monitoring.forms.Sync', {
	extend: 'Ext.form.Panel',
	requires: ['Ext.field.Password'],
	
	config: {
		title: 'Настройки',
		iconCls: 'settings',
		items: [{
			xtype: 'textfield',
			label: 'Пользователь',
			name: 'username',
			value: username
		},
		{
            xtype: 'passwordfield',
            name: 'password',
            label: 'Пароль',
            value: password
        },
        {
            xtype: 'button',
            text: 'Сохранить',
            ui: 'confirm',
			handler: function() {
				var data = this.up('formpanel').getValues();
				localStorage.setItem('stations_username', data.username);
				username = data.username;
				localStorage.setItem('stations_password', data.password);
				password = data.password;
			}
        },
        {
            xtype: 'button',
            text: 'Синхронизация',
            ui: 'confirm',
			handler: function() {
				exportOffers();
			}
        },
        {
        	xtype: 'label',
        	html: 'V1.2 22.05.2012',
        	id: 'version-info'
        }]
	}
});
