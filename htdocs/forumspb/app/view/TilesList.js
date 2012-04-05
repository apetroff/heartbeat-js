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
        
		//scrollable: false,
		
		items: [{
			
			left: 120,
			top: 120,
			xtype: 'container',
			width: 1680,
			height: 840,
			
			style: 'background-color: #759E60;  font-size: 60px;',
			
			layout: {
				type: 'vbox',
				pack: 'middle',
				align: 'center'
			},
			items: [{
				html: 'Centered banner',
			}],
			
		}, {
			
			left: 0,
			top: 0,
			xtype: 'container',
			width: 120,
			height: 120,
			
			style: 'background-color: #F88; font-size: 60px;',
			
			layout: {
				type: 'vbox',
				pack: 'middle',
				align: 'center'
			},
			items: [{
				style: '-webkit-transform: rotate(135deg)',
				html: '1'
			}],
			
		}, {
			
			left: 1800,
			top: 0,
			xtype: 'container',
			width: 120,
			height: 120,
			
			style: 'background-color: #F88; font-size: 60px;',
			
			layout: {
				type: 'vbox',
				pack: 'middle',
				align: 'center'
			},
			items: [{
				style: '-webkit-transform: rotate(-135deg)',
				html: '2'
			}],
			
		}, {
			
			left: 1800,
			top: 960,
			xtype: 'container',
			width: 120,
			height: 120,
			
			style: 'background-color: #F88; font-size: 60px;',
			
			layout: {
				type: 'vbox',
				pack: 'middle',
				align: 'center'
			},
			items: [{
				style: '-webkit-transform: rotate(-45deg)',
				html: '3'
			}],
			
		}, {
			
			left: 0,
			top: 960,
			xtype: 'container',
			width: 120,
			height: 120,
			
			style: 'background-color: #F88; font-size: 60px;',
			
			layout: {
				type: 'vbox',
				pack: 'middle',
				align: 'center'
			},
			items: [{
				style: '-webkit-transform: rotate(45deg)',
				html: '4'
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
