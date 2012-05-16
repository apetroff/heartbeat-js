/**
 * @class Tile
 * @extends Ext.data.Model
 * The Tile model is the only model we need in this simple application. We're using a custom Proxy for
 * this application to enable us to consume Ria's JSON api. See lib/RiaProxy.js to see how this is done
 */
Ext.define('Ria.model.Tile', {
    extend: 'Ext.data.Model',

    config: {
		idProperty: "_id",
        fields: [
            {name: "_id", type: "string"},
			{name: "title", type: "string"},
			"tickers",
			'score',
			{name: 'region', type: 'string'},
			{name: 'sector', type: 'string'},
            {name: 'id', type: 'string'}
        ]
    }
});
