Ext.define('Ria.view.UserSpace', {
    extend: 'Ext.Panel',
    xtype : 'userspace',
    requires: [
		'Ria.view.AuthForm',
		'Ria.mt.Gestures'
	],

    config: {
        cls: Ext.baseCSSPrefix + 'list-item user-space',

        layout: {
            type: 'vbox',
			align: 'center',
            pack: 'center'
        },

		items: [{
			xtype: 'authform'
		}]
    },

	initialize: function () {
		this.callParent(arguments);

		if (!this.gestures) {
			this.gestures = Ext.create('Ria.mt.Gestures');
		}

		this.authForm = this.getAt(0);
		this.authForm.config.uid = this.config.uid;
		this.authForm.config.angle = this.config.angle;
		this.authForm.initHtml();

		this.element.dom.style.setProperty(
			'-webkit-transform',
			'rotate(' + this.config.angle + 'deg)'
		);
	}
});
