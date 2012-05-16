Ext.Loader.setPath({
    'Ext': '/a/lib/sencha-touch-2/src'
});

Ext.application({
    name: 'Ria',

    icon: 'resources/icons/icon.png',
    phoneStartupScreen: 'resources/loading/Homescreen.jpg',
    tabletStartupScreen: 'resources/loading/Homescreen~ipad.jpg',

    views : ['Main', 'Detail'],
    controllers: ['Controller'],
    models: ['Tile'],
    stores: ['Tiles'],

	launch: function() {
        Ext.create('Ria.view.Main');

		var tiles = document.getElementsByClassName('x-data-item');

		var canvas = document.querySelector('canvas');
		var cont = document.querySelector('.x-dataview-tiles');
		cont.appendChild(canvas);

		window.hockey = initHockey(canvas, {
			explosionSound: document.querySelector('audio'),

			onReset: function () {
			},

			onEndContact: function (index) {
				var tile = tiles[index];

				if (tile) {
					var cmp = Ext.getCmp(tile.id);
					cmp.collide();
					return cmp.getScore();
				} else {
					console.error('No tile with index %d', index);
					return null;
				}
			}
		});
    }
});


/* Disable gestures and context menu. */
document.addEventListener('gesturestart', function (e) {
	e.preventDefault();
	e.stopPropagation();
}, false);

document.addEventListener('contextmenu', function (e) {
	e.preventDefault();
	e.stopPropagation();
}, false);