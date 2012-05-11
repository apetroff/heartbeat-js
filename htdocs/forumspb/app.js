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

		var tiles = document.getElementsByClassName('x-data-item');

		var canvas = document.querySelector('canvas');
		var cont = document.querySelector('.x-dataview-tiles');
		cont.appendChild(canvas);

		var playedTiles = {};

		/*
		window.hockey = initHockey(canvas, {
			ballRadius: 30,

			explosionSound: document.querySelector('audio'),

			onReset: function () {
		        playedTiles = {};
				Array.prototype.forEach.call(tiles, function (tile) {
					tile.style.visibility = '';
				});
			},

			onEndContact: function (index) {
				if (!playedTiles[index]) {
					var tile = tiles[index];

					if (tile) {
						tile.style.visibility = 'hidden';
						playedTiles[index] = true;
					} else {
						console.error('No tile with index %d', index);
					}

					return true;
				}
				return false;
			}
		});
		*/
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