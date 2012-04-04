Ext.define('Monitoring.model.Salepoint', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'name', type: 'string'},
			{name: 'address', type: 'string'},
			{name: 'coords', type: 'string'},
			{name: 'type', type: 'string'},
			{name: 'ext_id', type: 'int'},
			{name: 'is_new', type: 'boolean'}
		],
		proxy: {
        	type: 'localstorage',
        	id: 'salepoints'
        }
	}
});
