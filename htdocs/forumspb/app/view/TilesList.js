Ext.define('Ria.view.TilesList', {
    extend: 'Ext.dataview.DataView',
    xtype : 'tileslist',
	
    requires: [
        'Ria.view.TileItem',
		'Ria.view.UserSpace',
		'Ria.layout.MonopolyLayout'
    ],

    config: {
        ui   : 'tiles',
        store: 'Tiles',
		
		useComponents: true,
        defaultType: 'tilesitem',
        
		scrollable: false,
		
		items: [ {
			left: 0,
			top: 0,
			xtype: 'container',

			cls: 'userspace-tile',
			
			layout: {
				type: 'vbox',
				pack: 'middle',
				align: 'center'
			},
			items: [ Ext.create('Ria.view.UserSpace', {
				angle: 180,
				uid: 0
			}) ]
		}, {
			
			left: 1800,
			top: 0,
			xtype: 'container',

			cls: 'userspace-tile',

			layout: {
				type: 'vbox',
				pack: 'middle',
				align: 'center'
			},
			items: [ Ext.create('Ria.view.UserSpace', {
				angle: 180,
				uid: 1
			}) ]
		}, {
			
			left: 1800,
			top: 960,
			xtype: 'container',

			cls: 'userspace-tile',
			
			layout: {
				type: 'vbox',
				pack: 'middle',
				align: 'center'
			},
			items: [ Ext.create('Ria.view.UserSpace', {
				angle: 0,
				uid: 3
			}) ]
		}, {
			
			left: 0,
			top: 960,
			xtype: 'container',
			width: 120,
			height: 120,

			cls: 'userspace-tile',
			
			layout: {
				type: 'vbox',
				pack: 'middle',
				align: 'center'
			},
			items: [ Ext.create('Ria.view.UserSpace', {
				angle: 0,
				uid: 2
			}) ]
		}]
    },
	
	initialize: function() {
		this.callParent();
		
		this.container.setLayout('monopoly');
	},
	
	/**
     * Used so the "sorry something went wrong" message doesn't appear on first load
     * @private
     */
    refreshed: false,

    onLoad: function() {
        var me = this,
            store = me.getStore();

        me.callParent(arguments);

        if (store.getCount() === 0 && store.isLoaded()) {
            me.setMasked({
                xtype: 'loadmask',
                indicator: false,
                message: 'Sorry, Ria is having issues right now.'
            });

            me.getScrollable().getScroller().setDisabled(true);
        }
    }
});
