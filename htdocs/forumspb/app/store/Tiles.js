Ext.define('Ria.store.Tiles', {
    extend: 'Ext.data.Store',

    config: {
        model: 'Ria.model.Tile',
        autoLoad: true,
        remoteFilter: true,
		
		proxy: {
            type: 'ajax',
			url : '/forumspb/tiles.json',

            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }
    }
});
