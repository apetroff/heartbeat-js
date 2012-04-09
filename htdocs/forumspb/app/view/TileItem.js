
Ext.define('Ria.view.TileItem', {
    extend: 'Ext.dataview.component.DataItem',
    xtype : 'tilesitem',
    requires: ['Ext.Img'],

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

		this.element.dom.addEventListener('touchstart', Ext.bind(this.touchTrace, this));
		this.element.dom.addEventListener('touchmove', Ext.bind(this.touchTrace, this));
		this.element.dom.addEventListener('touchend', Ext.bind(this.touchTrace, this));
		
	},
	
	touchTrace: function(e) {
		console.log (this.id, e);
	}
});
