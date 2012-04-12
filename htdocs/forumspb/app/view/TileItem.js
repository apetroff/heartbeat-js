Ext.define('Ria.view.TileItem', {
    extend: 'Ext.dataview.component.DataItem',
    xtype : 'tilesitem',
    requires: ['Ext.Img', 'Ria.mt.Gestures'],

    config: {
	
		dataMap: {
            getTitle: {
                setHtml: 'title'
            },

//            getImage: {
//                setSrc: 'image'
//            }
        },

        cls: Ext.baseCSSPrefix + 'list-item floatTile',

        title: {
            cls: 'title'
        },

//        image: {
//            docked: 'left'
//        },

        layout: {
            type: 'vbox',
			align: 'center',
            pack: 'center'
        }
    },

    applyTitle: function(config) {
        return Ext.factory(config, Ext.Component, this.getTitle());
    },

    updateTitle: function(newTitle) {
        if (newTitle) {
            this.add(newTitle);
        }
    },

//    applyImage: function(config) {
//        return Ext.factory(config, Ext.Img, this.getImage());
//    },
//
//    updateImage: function(newImage) {
//        if (newImage) {
//            this.add(newImage);
//        }
//    }

	initialize: function() {
		this.callParent(arguments);

		if (!this.gestures) {
			this.gestures = Ext.create('Ria.mt.Gestures');
		}

		this.gestures.addListener(
			this.element.dom, 'tap',
			this.onTileTap
		);
	},
	
	onTileTap: function (e) {
		console.info('TAP', this.id);
	}
});
