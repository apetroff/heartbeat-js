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

		var playedTiles = {};
		var tiles = document.getElementsByClassName('x-data-item');

		var tileW = 120;
		var tileH = 120;

		window.arcanoid = initArcanoid(
			document.querySelector('canvas'), {
				ballRadius: 30,

				explosionSound: document.querySelector('audio'),

				onContact: function (point, game) {
					var maxX = ~~((game.width * game.scale) / tileW);
					var maxY = ~~((game.height * game.scale) / tileW);

					var indexX = ~~(point.x / tileW) + 1;
					var indexY = ~~(point.y / tileH) + 1;

					if (indexY == maxY) {
						var index = maxX + maxY + (maxX - indexX);
					} else if (indexX == 1 && indexY > 1) {
						index = maxX + maxX + maxY + (maxY - indexY);
					} else if (indexY > 1) {
						index = indexX + indexY - 1;
					} else {
						index = indexX - 1;
					}

					/* The second contact. */
					if (index in playedTiles) {
						return true;
					}

					/* The first contact. */
					setTimeout(function () {
						if (!playedTiles[index]) {
							playedTiles[index] = true;

							game.explode(point);

							var tile = tiles[index];
							tile.style.visibility = 'hidden';
						}
					}, 50);

					return false;
				}
			}
		);
    }
});