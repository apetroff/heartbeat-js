Ext.define('Spief.view.about.List', {

	extend: 'Ext.List',
	xtype: 'aboutList',

	config: {
		title: 'Инфо',
		ui: 'round',
		itemTpl: [ '{title}' ]
	},

	initialize: function() {
		this.callParent();
		this.setData(Spief.app.aboutPages);
	}
});
