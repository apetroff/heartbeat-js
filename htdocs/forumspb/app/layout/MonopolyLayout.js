Ext.define('Ria.layout.MonopolyLayout', {
	extend: 'Ext.layout.ContainerLayout',
	alias: 'layout.monopoly',
	
	doItemAdd: function(item, i) {
		
		this.callParent(arguments);
		
		var style = item.element.dom.style;
		
		console.log (i, item, style);
		
		style.setProperty('position','absolute');
		style.setProperty('left',(i % 4) * 120 + 'px');
		style.setProperty('top',~~(i / 4) * 120  + 'px');
		
		
		item.setSize(120, 120);
	}
});