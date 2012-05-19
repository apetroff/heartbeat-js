Ext.define('Spief.view.companies.News', {
	extend: 'Ext.List',
    xtype: 'newslist',

    config: {
		title: 'Новости',
		itemCls: 'news',
        ui: 'round',
		itemTpl: Ext.create('Ext.XTemplate',
			'<h1><date>{[this.format(values.date)]}</date>{title}</h1>',
			{
				format: function(date) {
					return Ext.Date.format(date, "d.m.Y H:i")
				}
			}
		),
		store: 'News'
    }
});