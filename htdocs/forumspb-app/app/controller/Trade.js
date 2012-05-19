Ext.define('Spief.controller.Trade', {
	extend: 'Ext.app.Controller',
	
	config: {
		refs: {
			buyForm: 'buyForm',
			buyCountField: 'buyForm spinnerfield',
			buyCacheField: 'buyForm numberfield[name=cache]',
			buyRemainField: 'buyForm numberfield[name=remain]',
			buyOkButton: 'buyForm button[ui=confirm]',
			buyCancelButton: 'buyForm button[ui=decline]',
			
			sellForm: 'sellForm',
			sellCountField: 'sellForm spinnerfield',
			sellCacheField: 'sellForm numberfield[name=cache]',
			sellRemainField: 'sellForm numberfield[name=remain]',
			sellOkButton: 'sellForm button[ui=confirm]',
			sellCancelButton: 'sellForm button[ui=decline]'
		},
		
		control: {
			
			buyForm: {
				show: 'onBuyFormShow'
			},
			
			buyCountField: {
				spin: 'onBuyCountFieldSpin'
			},
			
			buyOkButton: {
				tap: 'onBuyOkTap'
			},
			
			buyCancelButton: {
				tap: 'onBuyCancelTap'
			},
			
			sellForm: {
				show: 'onSellFormShow'
			},
			
			sellCountField: {
				spin: 'onSellCountFieldSpin'
			},
			
			sellOkButton: {
				tap: 'onSellOkTap'
			},
			
			sellCancelButton: {
				tap: 'onSellCancelTap'
			}
		}
	},
	
	launch: function() {
		Spief.accountModel.on('sync', this.onAccountSync, this);
	},
	
	onAccountSync: function() {
		//console.log('account updated');
	},
	
	onBuyCountFieldSpin: function() {
	
		this.recalculateBuyAccount();
	},
	
	onBuyFormShow: function() {
		
		this.companyModel = Spief.companyModel;		
		this.daily = this.companyModel.get('daily');
		this.companyId = this.companyModel.getId();
		
		this.setBuyRange();
		Spief.accountModel.recalculate();
		this.recalculateBuyAccount();
	},
	
	onBuyOkTap: function() {
		
		var briefcase = Spief.accountModel.get('briefcase'),
			newBriefcase = Ext.clone(briefcase) || {},
			
			last = this.daily.last,
			
			count = this.getBuyCountField().getValue(),
			cache = count*last,
			remain = Spief.accountModel.get('cache') - cache;
			
		newBriefcase[this.companyId] = (newBriefcase[this.companyId] || 0) + count;
		
		Spief.accountModel.set({
			cache: remain,
			briefcase: newBriefcase
		});
		
		Spief.accountModel.recalculate();
		
		this.getBuyForm().setMasked({
			xtype: 'loadmask',
			message: '',
			indicator: true
		});
		
		Spief.accountModel.save({
			success: function() {
				this.getBuyForm().setMasked(false);
				this.buyHide();
			}
		}, this);
		
		Spief.util.Prime.briefcaseCompaniesUpdate();
	},
	
	onBuyCancelTap: function() {
		this.buyHide();
	},
	
	// - - -
	
	onSellCountFieldSpin: function() {
	
		this.recalculateSellAccount();
	},
	
	onSellFormShow: function() {
		
		this.companyModel = Spief.companyModel;		
		this.daily = this.companyModel.get('daily');
		this.companyId = this.companyModel.getId();
		
		this.setSellRange();
		Spief.accountModel.recalculate();
		this.recalculateSellAccount();
	},
	
	onSellOkTap: function() {
		
		var briefcase = Spief.accountModel.get('briefcase'),
			newBriefcase = Ext.clone(briefcase) || {},
			
			last = this.daily.last,
			
			count = this.getSellCountField().getValue(),
			cache = count*last,
			remain = Spief.accountModel.get('cache') + cache;
			
		newBriefcase[this.companyId] = newBriefcase[this.companyId] - count;
		
		if (newBriefcase[this.companyId] == 0) delete newBriefcase[this.companyId];
		
		Spief.accountModel.set({
			cache: remain,
			briefcase: newBriefcase
		});
		
		Spief.accountModel.recalculate();
		
		this.getSellForm().setMasked({
			xtype: 'loadmask',
			message: '',
			indicator: true
		});
		
		Spief.accountModel.save({
			success: function() {
				this.getSellForm().setMasked(false);
				this.sellHide();
			}
		}, this);
		
		Spief.util.Prime.briefcaseCompaniesUpdate();
	},
	
	onSellCancelTap: function() {
		this.sellHide();
	},
	
	// - - - -
	
	buyHide: function() {
		this.getBuyForm().reset();
		this.getBuyForm().hide();
	},
	
	sellHide: function() {
		this.getSellForm().reset();
		this.getSellForm().hide();
	},
	
	setBuyRange: function() {
		
		var last = parseFloat(this.daily.last),
			cache = Spief.accountModel.get('cache'),
			maximum = ~~(cache/last),
			defaultValue = ~~(maximum/2),
			increment = (maximum > 100) ? 10 : 1;
			
		//console.log(maximum, defaultValue, increment);
			
		this.getBuyCountField().setIncrement(increment);
		this.getBuyCountField().setMaxValue(maximum);
		this.getBuyCountField().setValue(defaultValue);
		
	},
	
	setSellRange: function() {
		
		var last = parseFloat(this.daily.last),
			briefcase = Spief.accountModel.get('briefcase'),
			maximum = briefcase[this.companyId],
			defaultValue = ~~(maximum/2),
			increment = (maximum > 100) ? 10 : 1;
		
		//console.log(maximum, defaultValue, increment);
				
		this.getSellCountField().setIncrement(increment);
		this.getSellCountField().setMaxValue(maximum);
		this.getSellCountField().setValue(defaultValue);
		
	},
	
	recalculateBuyAccount: function() {
		
		var last = parseFloat(this.daily.last),
			cache = ~~(this.getBuyCountField().getValue()*last*1000)/1000,
			remain = ~~((Spief.accountModel.get('cache') - cache)*1000)/1000;
			
		this.getBuyCacheField().setValue(cache.toFixed(3));
		this.getBuyRemainField().setValue(remain.toFixed(3));
	},
	
	recalculateSellAccount: function() {
		
		var last = parseFloat(this.daily.last),
			cache = ~~(this.getSellCountField().getValue()*last*1000)/1000,
			remain = ~~((Spief.accountModel.get('cache') + cache)*1000)/1000;
			
		this.getSellCacheField().setValue(cache.toFixed(3));
		this.getSellRemainField().setValue(remain.toFixed(3));
	}
});
