Ext.define('Ria.store.Tiles', {
    extend: 'Ext.data.Store',

    config: {
        model: 'Ria.model.Tile',
        autoLoad: true,
        remoteFilter: true
    }
});
