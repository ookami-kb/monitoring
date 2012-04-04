Ext.define('Monitoring.model.Brand', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
        	{name: 'name', type: 'string'},
        	{name: 'ext_id', type: 'int'},
        ],
        proxy: {
        	type: 'localstorage',
        	id: 'brands'
        }
    }
});
