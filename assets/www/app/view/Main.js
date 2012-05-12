function onPhotoSuccess(imageURI) {
	Ext.Msg.alert('Photo', imageURI);
}

function onPhotoFail(message) {
	Ext.Msg.alert('Photo', message);
}

// Главная вьюха, к которой будут добавляться все списки
Ext.define('Monitoring.view.Main', {
    extend: 'Ext.navigation.View',
    selectedSPID: null,
    selectedWBID: null,
    
    config: {
    	title: 'Поиск',
    	id: 'main-view',
		iconCls: 'search',
    	items: [],
    }
});