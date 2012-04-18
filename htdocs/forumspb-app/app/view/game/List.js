Ext.define('Spief.view.game.List', {

	extend: 'Ext.List',
	xtype: 'games',

	config: {
		
		title: 'Игра',
		
		itemCls: 'gamer',
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
