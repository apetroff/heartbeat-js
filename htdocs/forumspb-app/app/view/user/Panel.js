Ext.define('Spief.view.user.Panel', {

	extend: 'Ext.Container',
	xtype: 'userPanel',

	config: {
		top: 5,
		right: 10,
		
		items: [{
			xtype: 'button',
			iconCls: 'lock_closed',
			labelCls: 'username',
			iconMask: true, 
			ui: 'action'
		}]
	}
});