Ext.define('Ria.layout.MonopolyLayout', {
	extend: 'Ext.layout.ContainerLayout',
	alias: 'layout.monopoly',
	
	doItemAdd: function(item, i) {
		
		this.callParent(arguments);
		
		var style = item.element.dom.style;
		
		if (i < 14) {
			
			style.setProperty('left', (i+1) * 120 + 'px');
			style.setProperty('top', 0);
			style.setProperty('-webkit-transform', 'rotate(180deg)');
		
		} else if (i < 21) {
		
			style.setProperty('left', 1800 + 'px');
			style.setProperty('top', (i-13) * 120  + 'px');
			style.setProperty('-webkit-transform', 'rotate(-90deg)');
					
		} else if (i < 35) {
		
			style.setProperty('left', (1800 - (i-20)*120) + 'px');
			style.setProperty('top', 960  + 'px');
		
		} else if (i < 42) {
			
			style.setProperty('left', 0 + 'px');
			style.setProperty('top', (960 - (i-34) * 120) + 'px');
			style.setProperty('-webkit-transform', 'rotate(90deg)');
			
		} else {

			style.setProperty('display', 'none');

		}
	},
	
	doLayout: function() {
		//TODO: move layout actions here and need handle add/remove items
	}
});