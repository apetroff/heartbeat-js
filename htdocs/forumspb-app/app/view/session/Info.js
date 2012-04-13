Ext.define('Spief.view.session.Info', {

	extend: 'Ext.Component',
	xtype: 'sessionInfo',

	config: {

		cls: 'sessionInfo',

		tpl: Ext.create('Ext.XTemplate',
			'<h3>{title} <small>{topic}</small></h3>',
			'<h4>{proposal_type} в {[this.formatTime(values.startDate)]}</h4>',
			{
				formatTime: function(time) {
					return Ext.Date.format(time, 'G:i, d F Y')
				}
			}
		)
	}
});
