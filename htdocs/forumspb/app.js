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

		var playedTiles = {};

		window.hockey = initHockey(canvas, {
			ballRadius: 30,

			explosionSound: document.querySelector('audio'),

			onReset: function () {
		        playedTiles = {};
				Array.prototype.forEach.call(tiles, function (tile) {
					Ext.getCmp(tile.id)._show();
				});
			},

			onEndContact: function (index) {
				if (!playedTiles[index]) {
					var tile = tiles[index];

					if (tile) {
						Ext.getCmp(tile.id)._hide();
						playedTiles[index] = true;
					} else {
						console.error('No tile with index %d', index);
					}

					return true;
				}
				return false;
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