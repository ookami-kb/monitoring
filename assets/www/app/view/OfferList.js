Ext.define('OfferListItem', {
    extend: 'Ext.dataview.component.DataItem',
    xtype: 'offerlistitem',
 
    config: {
        name: {
            cls: 'x-name',
            flex: 1
        },
 
        price: {
            flex: 2
        },
 
        layout: {
            type: 'hbox',
            align: 'center'
        },
        
        dataMap: {
        	getName: {
        		setHtml: 'name'
        	},
        	
        	getPrice: {
        		setHtml: 'price'
        	}
        }
    },
    
    applyName: function(config) {
        return Ext.factory(config, Ext.Component, this.getName());
    },
    updateName: function(newName, oldName) {
        if (newName) {
            this.add(newName);
        }

        if (oldName) {
            this.remove(oldName);
        }
    },
    
    applyPrice: function(config) {
        return Ext.factory(config, Ext.Component, this.getPrice());
    },
    updatePrice: function(newName, oldName) {
        if (newName) {
            this.add(newName);
        }

        if (oldName) {
            this.remove(oldName);
        }
    },
    
});

Ext.define('MyApp.view.OfferList', {
	extend: 'Ext.dataview.List',
	requires: ['MyApp.store.Offers'],
	
	config: {
		id: 'of-list',
		store: 'Offers',
		title: 'Предложения',
	    xtype: 'list',
	    useComponents: true,
	    defaultType: 'offerlistitem',
	    itemTpl: '{name}. {volume} л. {price} р.',
	    listeners: {
	    	select: function(list, record, options) {
	    		var form = Ext.create('MyApp.forms.Offer', {record: record});
		    	Ext.getCmp('stations-view').push(form);
		    	list.deselectAll();
	    	}
	    }
	}
});