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
				explosionSound: document.querySelector('audio'),

				onContact: function (point, game) {
					var maxX = ~~((game.width * game.scale) / tileW) - 1;
					var maxY = ~~((game.height * game.scale) / tileW) - 1;

					var indexX = ~~(point.x / tileW);
					var indexY = ~~(point.y / tileH);

					var index = indexX + indexY;

					if (indexY == maxY) {
						index = maxX + maxY + ((maxX + 1) - indexX);
					} else if (indexX == 0 && indexY > 0) {
						index = maxX + maxX + maxY + ((maxY + 1) - indexY);
					}

					if (index in playedTiles) {
						return true;
					} else {
						setTimeout(function () {
							if (!playedTiles[index]) {
								playedTiles[index] = true;

								game.explode(point);

								var tile = tiles[index];
								tile.style.visibility = 'hidden';
							}
						}, 30);

						return false;
					}
				}
			}
		)
    }
});