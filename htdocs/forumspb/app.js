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
    }
});
