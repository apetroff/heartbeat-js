/**
 * @class Tile
 * @extends Ext.data.Model
 * The Tile model is the only model we need in this simple application. We're using a custom Proxy for
 * this application to enable us to consume Ria's JSON api. See lib/RiaProxy.js to see how this is done
 */
Ext.define('Ria.model.Tile', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            {name: "_id", type: "string"},
			{name: "title", type: "string"},
			{name: "image", type: "string"},
            {name: "id", type: "string"}
        ],

        proxy: {
            type: 'ajax',
			url : '/forumspb/tiles.json',

            reader: {
                type: 'json',
                successProperty: 'success',
                rootProperty: function(data) {
                    if (data.error || data.query.count === 0) {
                        return [];
                    } else {
                        return data.query.results.tiles;
                    }
                }
            }
        }
    }
});
