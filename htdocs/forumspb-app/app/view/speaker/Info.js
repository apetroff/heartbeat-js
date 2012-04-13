Ext.define('Spief.view.speaker.Info', {

	extend: 'Ext.Container',
	xtype: 'speakerInfo',

	config: {

		cls: 'speakerInfo',
		tpl: [
			'<div class="header">',
				'<div class="avatar"',
				'<tpl if="avatar">',
					'style="background-image: url({avatar});"',
				'</tpl>',
				'></div>',
				'<h3>{name} {surname}</h3>',
				'<h4>{post}',
				'<tpl if="country">',
					', {country}',
				'</tpl>',
				'</h4>',
				'</div>'
		]
	}
});
