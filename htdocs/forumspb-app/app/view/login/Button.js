Ext.define('Spief.view.login.Button', {

	extend: 'Ext.Button',
	xtype: 'loginButton',

	config: {
		top: 5,
		right: 10,
		iconCls: 'lock_closed',
		iconMask: true, 
		ui: 'action'
	}
});