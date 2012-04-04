Ext.define('Monitoring.model.Offer', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
        	{name: 'salepoint_id', type: 'int'},
            {name: 'price', type: 'float'},
            {name: 'source_code', type: 'string'},
            {name: 'source_type', type: 'string'}
        ],
        proxy: {
        	type: 'localstorage',
        	id: 'offers'
        }
    }
});
