Ext.define('Ria.view.TileItem', {
    extend: 'Ext.dataview.component.DataItem',
    xtype : 'tilesitem',
    requires: ['Ext.Img', 'Ria.mt.Gestures'],

    config: {
        cls: Ext.baseCSSPrefix + 'list-item emitent-tile',

        layout: {
            type: 'vbox',
			align: 'center',
            pack: 'center'
        }
    },

	tpl: new Ext.XTemplate(
		'<div class="title">{title}</div>'
	).compile(),

	initialize: function() {
		this.callParent(arguments);

		if (!this.gestures) {
			this.gestures = Ext.create('Ria.mt.Gestures');
		}

		this.gestures.addListener(
			this.element.dom, 'tap',
			this.onTileTap
		);

		var rec = this.getRecord();
		this.element.dom.innerHTML = this.tpl.apply({
			title: rec.get('tickers')[0]
		});
	},
	
	onTileTap: function (e) {
		console.info('TAP', this.id);
	}
});

