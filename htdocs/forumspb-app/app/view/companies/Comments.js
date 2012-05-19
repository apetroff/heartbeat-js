Ext.define('Spief.view.companies.Comments', {
	extend: 'Ext.List',
    xtype: 'commentslist',

    config: {
		title: 'Комментарии',
		itemCls: 'comment',
        ui: 'round',
		itemTpl: Ext.create('Ext.XTemplate',
			'<h1><date>{[this.format(values.date)]}</date>{title}</h1>',
			'<p>{lead}</p>',
			{
				format: function(date) {
					return Ext.Date.format(date, "d.m.Y H:i")
				}
			}
		),
		store: 'Comments'
    }
});
