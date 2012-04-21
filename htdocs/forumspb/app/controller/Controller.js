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

    onListTap: function (list, tile) {
		var tpl = new Ext.XTemplate(
			'<h1>{title}</h1>',
			'<dl>',
				'<dt>Регион</dt>',
				'<dd>{region}</dd>',
				'<dt>Отрасль</dt>',
				'<dd>{sector}</dd>',
			'</dl>',
			'<strong>{[values.tickers.split(",")[0]]}</strong>',
			'<span>&mdash;{[~~(Math.random() * 20)]}%</span>'
		).compile();

		window.overlay.setHtml(tpl.apply(tile.data));
        window.overlay.showBy(Ext.getCmp(tile.id.replace('ext-record-', 'ext-tilesitem-')));
    }
});
