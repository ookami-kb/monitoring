Ext.define('Monitoring.view.ProductListItem', {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'productlistitem',
	requires: ['Ext.field.Number'],
	
	config: {
		cls: 'product-list-item',
		dataMap: {
			getName: {
				setHtml: 'title'
			},
			getPrice: {
				setValue: 'price'
			}
		},
		name: {
            cls: 'x-name',
            flex: 2,
            listeners: {
            	painted: function(component, opts) {
            		if (component.parent.getRecord().get('is_new') == true) {
            			component.addCls('is-new');
            		}
            	}
            }
        },
        price: {
        	cls: 'x-price',
        	flex: 1,
        	listeners: {
        		change: function(field, newValue, oldValue, opts) {
        			field.parent.getRecord().set({price: newValue});
        			var val = field.parent.getRecord().getData();
        			Ext.create('Monitoring.model.Offer', val, val.id).save({
        				failure: function() {
        					Ext.Msg.alert('Ошибка', 'Не удалось сохранить предложение');
        				}
        			});
        		}
        	}
        },
        layout: {
            type: 'hbox',
            align: 'center'
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
        return Ext.factory(config, Ext.field.Number, this.getPrice());
    },
    updatePrice: function(newPrice, oldPrice) {
        if (newPrice) {
            this.add(newPrice);
        }

        if (oldPrice) {
            this.remove(oldPrice);
        }
    }
});
