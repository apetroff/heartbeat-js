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

		window.overlay = Ext.Viewport.add({
            xtype: 'panel',

            // We give it a left and top property to make it floating by default
            left: 0,
            top: 0,

            // Make it modal so you can click the mask to hide the overlay
            modal: true,
            hideOnMaskTap: true,

            // Make it hidden by default
            hidden: true,

            // Set the width and height of the panel
            width: 600,
            height: 500,

            // Style the content and make it scrollable
            styleHtmlContent: true,
            scrollable: true,

            // Insert a title docked at the top with a title
            items: [
                {
                    docked: 'top',
                    xtype: 'toolbar',
                    title: 'Информация о комании'
                }
            ]
        });

		var playedTiles = {};
		var tiles = document.getElementsByClassName('x-data-item');

		var tileW = 120;
		var tileH = 120;

		var getIndex = function (point, game) {
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

			return index;
		};

		window.arcanoid = initArcanoid(
			document.querySelector('canvas'), {
				ballRadius: 30,

				explosionSound: document.querySelector('audio'),

				onPreSolve: function (point, game) {
					var index = getIndex(point, game);
					return index in playedTiles;
				},

				onEndContact: function (point, game) {
					var index = getIndex(point, game);

					if (!playedTiles[index]) {
						var tile = tiles[index];

						if (tile) {
							tile.style.visibility = 'hidden';

							setTimeout(function () {
								playedTiles[index] = true;
							}, 50);

							return true;
						} else {
							console.error('No tile with index %d', index);
						}
					}

					return false;
				}
			}
		);
    }
});