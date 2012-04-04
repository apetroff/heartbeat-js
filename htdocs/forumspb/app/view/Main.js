Ext.define('Ria.view.Main', {
    extend: 'Ext.Container',
    xtype: 'mainview',
    requires: [
		'Ria.view.TilesList'
    ],

    config: {
        fullscreen: true,
		layout: 'fit',
		items: [{
			xtype: 'tileslist'
		}]
    }
});
