Ext.define('Spief.view.speaker.List', {

	extend: 'Ext.List',
	xtype: 'speakers',

	config: {

		title: 'Участники',

		itemCls: 'speaker',
		itemTpl: [
			'<div class="avatar"',
			'<tpl if="avatar">',
				'style="background-image: url({avatar});"',
			'</tpl>',
			'></div>',
			'<h3>{name} {surname}</h3>',
			'<h4>{post}',
			'<tpl if="country">',
				' | {country}',
			'</tpl>',
			'</h4>'
		]
	}
});
