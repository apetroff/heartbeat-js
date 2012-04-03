/**
 * @class Ria.controller.Tiles
 * @extends Ext.app.Controller
 *
 * The only controller in this simple application - this simply sets up the fullscreen viewport panel
 * and renders a detailed overlay whenever a Tile is tapped on.
 */
Ext.define('Ria.controller.Controller', {
    extend: 'Ext.app.Controller',

    config: {
        profile: Ext.os.deviceType.toLowerCase(),

        refs: {
            main: 'mainview',
            tilesList: 'tileslist',
            searchField: 'searchfield',
            refreshButton: 'button[iconCls=refresh]'
        },

        control: {
            'tileslist': {
                select: 'onListTap'
            },
            'detail': {
                hideanimationstart: 'onDetailHideAnimationStart'
            },
            'searchfield': {
                action: 'onSearch'
            },
            'selectfield': {
                change: 'onSelectChange'
            },
            'button[iconCls=refresh]': {
                tap: 'onRefreshButtonTap'
            }
        }
    },

    init: function() {
        Ext.getStore('Tiles').on({
            scope: this,

            beforeload: this.onBeforeStoreLoad,
            load: this.onStoreLoad
        });
    },

    onListTap: function(list, tile) {
        if (!this.view) {
            this.view = Ext.create('Ria.view.Detail');
        }

        var view = this.view;
        view.setTile(tile);

        if (this.getProfile() == "phone") {
            view.setWidth(null);
            view.setHeight('85%');
            view.setTop(null);
            view.setLeft(0);
        }

        if (!view.getParent()) {
            Ext.Viewport.add(view);
        }

        view.show();
    },

    onSearch: function(field) {
        
    },

    onSelectChange: function(field) {
        if (!field.initialized) {
            return;
        }

        var config = {};
        config[field.getName()] = field.getValue();
    },

    onDetailHideAnimationStart: function() {
        this.getTilesList().deselectAll();
    },

    onRefreshButtonTap: function() {
        var store = Ext.getStore('Tiles'),
            hasValue = Boolean(this.getSearchField().getValue().length);

        if (!hasValue) {
            store.clearFilter();
        }

        store.load();
    },

    onBeforeStoreLoad: function() {
        this.getRefreshButton().setDisabled(true);
    },

    onStoreLoad: function() {
        //
    }
});
