Ext.define('Ria.layout.MonopolyLayout', {
	extend: 'Ext.layout.ContainerLayout',
	alias: 'layout.monopoly',
	
	doItemAdd: function (item, i) {
		this.callParent(arguments);

		item._size = 120;
		
		if (i < 14) {
			item._position = {
				x: (i + 1) * item._size,
				y: 0,
				angle: 180
			};
		} else if (i < 21) {
			item._position = {
				x: 1800,
				y: (i - 13) * item._size,
				angle: -90
			};
		} else if (i < 35) {
			item._position = {
				x: 1800 - (i - 20) * item._size,
				y: 960,
				angle: 0
			};
		} else if (i < 42) {
			item._position = {
				x: 0,
				y: 960 - (i - 34) * item._size,
				angle: 90
			};
		} else {
			/* Extra data. */
			item.element.dom.parentNode.removeChild(
				item.element.dom
			);
			return;
		}

		item._position.maxX = 1800;
		item._position.maxY = 960;

		var style = item.element.dom.style;
		style.setProperty('left', item._position.x + 'px');
		style.setProperty('top',  item._position.y + 'px');
		style.setProperty(
			'-webkit-transform',
			'rotate(' + item._position.angle + 'deg)'
		);
	},
	
	doLayout: function () {
		//TODO: move layout actions here and need handle add/remove items
	}
});