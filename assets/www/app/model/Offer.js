Ext.define('Monitoring.model.Offer', {
    extend: 'Ext.data.Model',

    config: {
    	idProperty : 'uniqueid', // if we have field with name as id, conflicts happens with default idProperty(id) which always have value as ext-record-x
		clientIdProperty : 'id',
        fields: [
        	{name: 'salepoint_id', type: 'int'},
            {name: 'price', type: 'float'},
            {name: 'source_code', type: 'string'},
            {name: 'source_type', type: 'string'},
            {name: 'title', type: 'string'},
            {name: 'whitebrand_id', type: 'int'},
            {name: 'is_new', type: 'int'},
            {
				name: 'id',
				type: 'int',
				fieldOption: 'PRIMARY KEY'
			}
        ],
        proxy: {
        	type: 'sqlitestorage',
        	dbConfig: {
				tablename: 'offers_tables',
				dbConn: Ext.DbConnection
				//dbQuery 	: 'SELECT * FROM contact_table limit 0,1' //dbQuery only works with read operation
			},
			reader: {
				type: 'array'
			}
        }
    },
    writer: {
		type: 'array'
	},
	
});
