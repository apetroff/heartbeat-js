/**
 * @class Ria.views.TileInfo
 * @extends Ext.Sheet
 *
 * We use this Ext.Sheet subclass to display information about a particular Tile when the user has tapped on it.
 * Ext.Sheet is an overlay class that slides in from above, below or one of the sides, usually in response to a
 * user action such as tapping on a list item.
 *
 * In this class we set the sheet up to be modal (masks the rest of the page) and to enter and exit from the
 * right hand edge of the screen. It hides itself when the user taps on the modal mask (via the hideOnMaskTap config).
 *
 * Inside the class we have an Ext.Carousel with three cards - details, payments and map. Each card is set up
 * inside its own function to make it easy to see what is going on. The TileInfo sheet is rendered and shown by
 * the tile controller's 'show' action (see app/controllers/tiles.js).
 *
 */
Ext.define('Ria.view.Detail', {
    extend: 'Ext.Panel',
    xtype: 'detail',

    requires: [
        'Ria.view.detail.Information',
        'Ria.view.detail.Schedule',
        'Ria.view.detail.Map',
        'Ext.carousel.Carousel'
    ],

    config: {
        baseCls: Ext.baseCSSPrefix + 'sheet',
        modal: true,
        centered : false,
        hideOnMaskTap : true,

        ui: 'detail',

        // we always want the sheet to be 400px wide and to be as tall as the device allows
        width: 400,
        top: 0,
        bottom: 0,
        right: 0,

        tile: null,

        layout: {
            type: 'vbox',
            align: 'stretch'
        },

        items: [
            {
                xtype: 'carousel',
                flex: 1,
                items: [
                    { xtype: 'detailInformation' },
                    { xtype: 'detailSchedule' },
                    { xtype: 'detailMap' }
                ]
            },
            {
                xtype: 'button',
                text: 'Lend $25'
            }
        ]
    },

    hide: function(animation) {
        var me = this;

        //we fire this event so the controller can deselect all items immediately.
        me.fireEvent('hideanimationstart', me);

        //show the mask again
        me.callParent();
    },

    updateTile: function(newTile) {
        var carousel = this.down('carousel'),
            information = this.down('detailInformation'),
            payments = this.down('detailSchedule'),
            map = this.down('detailMap'),
            coords = newTile.get('location').geo.pairs.split(' ').map(parseFloat);

        information.setData(newTile.data);
        payments.setData(newTile.data.terms.scheduled_payments);

        //update the lend button
        this.updateLendButton();

        //update the map
        if (this.mapMarker) {
            this.mapMarker.setMap(null);
            delete this.mapMarker;
        }

        //add a marker for the Tileee's position on the map
        this.mapMarker = new google.maps.Marker({
            map: map.map,
            title : newTile.get('name'),
            position: new google.maps.LatLng(coords[0], coords[1])
        });

        carousel.setActiveItem(0);

        map.setMapCenter(this.mapMarker.position);
    },

    updateLendButton: function() {
        var url    = "http://www.Ria.org/lend/" + this.getTile().getId(),
            button = this.down('button'),
            link = Ext.getDom('linker'),
            clickEvent = document.createEvent('Event');

        //http://www.sencha.com/forum/showthread.php?130358-window.open()-from-toolbar-button-opens-window-from-list-item-a-new-tab&p=639938#post639938
        clickEvent.initEvent('click', true, false);

        button.setHandler(function() {
            link.href = url;
            link.dispatchEvent(clickEvent);
        });
    }
});
