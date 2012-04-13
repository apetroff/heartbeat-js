Ext.define('Spief.view.about.Location', {

	extend: 'Ext.Container',
	requires: 'Ext.Map',

	xtype: 'location',

	config: {
		layout: 'fit',
	},

	initialize: function() {
		var position = new google.maps.LatLng(Spief.app.mapCenter[0], Spief.app.mapCenter[1]),
			infoWindow = new google.maps.InfoWindow({ content: Spief.app.mapText }),
			map, marker;

		this.callParent();

		map = this.add({
			xtype: 'map',
			mapOptions: {
				center: position,
		        mapTypeId: google.maps.MapTypeId.ROADMAP
			}
		});

		marker = new google.maps.Marker({
	        position: position,
	        map: map.getMap(),
	        visible: true
	    });

	    google.maps.event.addListener(marker, 'click', function() {
	        infoWindow.open(map, marker);
	    });
	}
});
