Ext.define('Spief.util.Prime', {
	
	singleton: true,
	
	process: function(url, callback) {

		var me = this,
			companyModel;
		
		me.companiesStore = Ext.getStore('Companies');
		me.tickersStore = Ext.getStore('Tickers');
		
		me.tickersStore.on('load', me.onTickersLoaded, me);
		
		Ext.data.JsonP.request({
		    url: url,
		    callbackName: 'companiesCb',

		    success: function(data) {

		        Ext.Array.each(data.companies, function(company) {

		            companyModel = Ext.create('Spief.model.Company', company);
					me.companiesStore.add(companyModel);
					
		        });
				
				me.tickersStore.load();
				
				callback();
		    }
		});
	},
	
	onTickersLoaded: function(store, records) {
		
		var me = this;
		
		records.map(function(daily) {
			var id = daily.getId(),
				companyModel = me.companiesStore.getById(id);
			
			companyModel.set('daily', daily.data);
		});
		
		if (Spief.accountModel) Spief.accountModel.recalculate();
		
	}
	
});


Ext.override(Ext.data.writer.Writer, {

	/**
	* Formats the data for each record before sending it to the server. This
	* method should be overridden to format the data in a way that differs from the default.
	* @param {Object} record The record that we are writing to the server.
	* @return {Object} An object literal of name/value keys to be written to the server.
	* By default this method returns the data property on the record.
	*/
	getRecordData: function(record) {
		var isPhantom = record.phantom === true,
		writeAll = this.writeAllFields || isPhantom,
		nameProperty = this.nameProperty,
		fields = record.fields,
		data = {},
		changes,
		name,
		field,
		key;

		if (writeAll) {
			fields.each(function(field){
				if (field.persist) {
					name = field[nameProperty] || field.name;
					var value = data[name] = record.get(field.name);
					if (field.dateFormat && Ext.isDate(value)){
						data[name] = Ext.Date.format(value, field.dateFormat == 'timestamp' ? 'U' : field.dateFormat);
					}

				}
			});
		} else {
			// Only write the changes
			changes = record.getChanges();
			for (key in changes) {
				if (changes.hasOwnProperty(key)) {
					field = fields.get(key);
					name = field[nameProperty] || field.name;
					if (field.dateFormat && Ext.isDate(changes[key])){
						data[name] = Ext.Date.format(changes[key], field.dateFormat == 'timestamp' ? 'U' : field.dateFormat);
					} else {
						data[name] = changes[key];
					}
				}
			}
			
			if (!isPhantom) {
				// always include the id for non phantoms
				data[record.idProperty] = record.getId();
			}
		}
		
		return data;
	}
});