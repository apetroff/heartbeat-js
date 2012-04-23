Ext.define('Spief.view.about.HtmlPage', {

	extend: 'Ext.Container',
	xtype: 'htmlPage',

    config: {
        scrollable: 'vertical',
        cls: 'htmlPage'
    },

	initialize: function() {

		 Ext.Ajax.request({
            url: this.config.url,
            success: function(rs) {
                this.setHtml('<div class="wrapper">'+rs.responseText+'</div>');
            },
            scope: this
        });
	}
});
