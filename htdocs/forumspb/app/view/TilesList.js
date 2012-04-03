/**
 * @class Ria.views.List
 * @extends Ext.DataView
 */
Ext.define('Ria.view.TilesList', {
    extend: 'Ext.DataView',
    xtype : 'tileslist',
    requires: [
        'Ria.view.TileItem'
    ],

    config: {
        ui   : 'tiles',
        store: 'Tiles',
        useComponents: true,
        defaultType: 'tileslistitem',
        deselectOnContainerClick: false
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
