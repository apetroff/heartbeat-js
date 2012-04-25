Ext.define('Spief.view.about.List', {

	extend: 'Ext.List',
	xtype: 'aboutList',

	config: {
		title: 'Информация',
		ui: 'round',
		itemTpl: [ '{title}' ],
		
		items:[{
			xtype: 'container',
			docked: 'top',
			cls: 'about',
			html: '<img src="http://2012.forumspb.com/img/logo_ru.png"></img>'
		}]
		
	},

	initialize: function() {
		this.callParent();
		this.setData(Spief.app.aboutPages);
	}
});
