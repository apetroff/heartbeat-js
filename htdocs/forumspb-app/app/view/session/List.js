Ext.define('Spief.view.session.List', {

	extend: 'Ext.List',
	requires: 'Ext.SegmentedButton',

	xtype: 'sessions',

	config: {

		items: [
			{
				docked: 'top',
				xtype: 'toolbar',
				ui: 'gray',

				items: [
					{
						width: '100%',
						padding: '0 5',
						defaults: {
							flex: 1
						},
						xtype: 'segmentedbutton',
						allowDepress: false
					}
				]
			}
		],

		itemTpl: [
			'<div class="session"><div class="title">{title}</div><div class="topic">{topic}</div></div>'
		]
	},

	initialize: function() {
		this.config.title = Spief.app.title;
		this.callParent();

		var segmentedButton = this.down('segmentedbutton');

		Ext.Array.each(Spief.sessionDays, function(day) {
			segmentedButton.add(day)
		});
	}
});
