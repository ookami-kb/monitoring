Ext.define('Monitoring.model.Product', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
        	{name: 'title', type: 'string'},
        	{name: 'title_extra', type: 'string'},
        	{name: 'manufacturer', type: 'string'},
        	{name: 'whitebrand_id', type: 'int'},
        	{name: 'source_code', type: 'int'},
        	{name: 'source_type', type: 'string'},
        	{name: 'type', type: 'string'},
        	{name: 'is_new', type: 'boolean'}
        	// {name: 'modified', type: 'boolean'}
        ],
        proxy: {
        	type: 'localstorage',
        	id: 'products'
        }
    }
});
