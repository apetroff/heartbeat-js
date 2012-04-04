Ext.define('Ria.view.TilesList', {
    extend: 'Ext.dataview.DataView',
    xtype : 'tileslist',
	
    requires: [
        'Ria.view.TileItem',
		'Ria.layout.MonopolyLayout'
    ],

    config: {
        ui   : 'tiles',
        store: 'Tiles',
		
		useComponents: true,
        defaultType: 'tilesitem',
        
		deselectOnContainerClick: false,
		
		scrollable: false,
		
		items: [{
			
			centered: true,
			xtype: 'container',
			width: 600,
			height: 300,
			
			style: 'background-color: #759E60;',
			
			layout: {
				type: 'vbox',
				pack: 'middle',
				align: 'center'
			},
			items: [{
				html: 'Centered banner',
			}],
			
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
