Ext.define('Monitoring.store.Offers', {
	extend: 'Ext.data.Store',
	config: {
		model: 'Monitoring.model.Offer',
	    // proxy: {
	        // // type: 'localstorage',
	        // // id: 'offers'
	        // dbConfig: {
				// tablename: 'offers_tables',
				// dbConn: Ext.DbConnection
				// //dbQuery 	: 'SELECT * FROM contact_table limit 0,1' //dbQuery only works with read operation
			// },
			// reader: {
				// type: 'array'
			// }
	    // },
	    
	    // autoLoad: true,
	    proxy: {
        	dbConfig: {
        		type: 'sqlitestorage',
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
	}
});