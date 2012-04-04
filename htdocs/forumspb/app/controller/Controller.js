/**
 * @class Ria.controller.Tiles
 * @extends Ext.app.Controller
 *
 * The only controller in this simple application - this simply sets up the fullscreen viewport panel
 * and renders a detailed overlay whenever a Tile is tapped on.
 */
Ext.define('Ria.controller.Controller', {
    extend: 'Ext.app.Controller',

    config: {
        profile: Ext.os.deviceType.toLowerCase(),

        refs: {
            tilesList: 'tileslist'
        },

        control: {
            'tileslist': {
                select: 'onListTap'
            }
        }
    },

    init: function() {
        
    },

    onListTap: function(list, tile) {
        
    }
});
