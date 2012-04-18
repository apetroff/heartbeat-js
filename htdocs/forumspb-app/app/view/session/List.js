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
						xtype: 'segmentedbutton',
						width: '100%',
						padding: '0 5',
						allowDepress: false,
						defaults: {
							flex: 1,
							ui: 'decline'
						}
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
