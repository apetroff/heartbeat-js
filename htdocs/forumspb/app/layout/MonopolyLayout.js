Ext.define('Ria.layout.MonopolyLayout', {
	extend: 'Ext.layout.ContainerLayout',
	alias: 'layout.monopoly',
	
	doItemAdd: function (item, i) {
		this.callParent(arguments);

		var CENTER_LEFT = 38;
		var CENTER_RIGHT = 17;
		var MAX_NUM = 42;

		if (i >= MAX_NUM) {
			item.element.dom.parentNode.removeChild(
				item.element.dom
			);
			return;
		}

		item._size = 120;
		
		if (i < 14) {
			item._position = {
				x: (i + 1) * item._size,
				y: 0,
				angle: 180,
				orientation: 180
			};
		} else if (i < 21) {
			item._position = {
				x: 1800,
				y: (i - 13) * item._size,
				angle: i < CENTER_RIGHT ? 180 : 0,
				orientation: -90
			};
		} else if (i < 35) {
			item._position = {
				x: 1800 - (i - 20) * item._size,
				y: 960,
				angle: 0,
				orientation: 0
			};
		} else if (i < MAX_NUM) {
			item._position = {
				x: 0,
				y: 960 - (i - 34) * item._size,
				angle: i > CENTER_LEFT ? 180 : 0,
				orientation: 90
			};
		}

		item._position.maxX = 1800;
		item._position.maxY = 960;
		item._index = i;

		var style = item.element.dom.style;
		style.setProperty('left', item._position.x + 'px');
		style.setProperty('top',  item._position.y + 'px');

		item.element.addCls('tile-orientation_' + item._position.orientation);
		item.element.addCls('tile-angle_' + item._position.angle);
	},
	
	doLayout: function () {
		//TODO: move layout actions here and need handle add/remove items
	}
});