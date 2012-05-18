Ext.define('Ria.view.TileItem', {
    extend: 'Ext.dataview.component.DataItem',
    xtype : 'tilesitem',
    requires: ['Ext.Img', 'Ria.mt.Gestures'],

    config: {
        cls: Ext.baseCSSPrefix + 'list-item emitent-tile',

        layout: {
            type: 'vbox',
			align: 'center',
            pack: 'center'
        }
    },

	tpl: new Ext.XTemplate(
		'<div class="title">{[values.tickers[0]]}</div>'
	).compile(),

	infoTpl: new Ext.XTemplate(
		'<div class="emitent-info"><div class="content">',
			'<h1>{title}</h1>',
			'<dl>',
				'<dt>Регион</dt>',
					'<dd>{region}</dd>',
				'<dt>Отрасль</dt>',
					'<dd>{sector}</dd>',
			'</dl>',
			'<strong>{[values.tickers[0]]}</strong>',
			'<p>',
				'<big>{[values.tickersData.changeProc || 0]}%</big>',
			'<p>',
		'</div></div>'
	).compile(),

	infoWindowSize: 360,

	infoWindowCloseDelay: 5000,

	initialize: function() {
		this.callParent(arguments);

		if (!this.gestures) {
			this.gestures = Ext.create('Ria.mt.Gestures');
		}

		this.gestures.addListener(
			this.element.dom, 'tap',
			Ext.bind(this.onTileTap, this)
		);

		this.element.dom.addEventListener(
			'click', Ext.bind(this.onTileTap, this), false
		);

		var rec = this.getRecord();
		this.element.dom.innerHTML = this.tpl.apply(rec.data);

		// FIXME: get the tiles list view
		this.list = window.tilesList = window.tilesList || {};

		this.list.openedTiles = [];

		this.onInfoWindowTap = Ext.bind(this.setInfoWindowTimeout, this);
	},

	getScore: function () {
		var tD = this.getTickersData();
		if (tD) {
			return ~~tD.high;
		}
		return 0;
	},

	removeInfoWindow: function () {
		if (this.container && this.infoWindowSize) {
			try {
				this.infoWindow.removeEventListener(
					'click', this.onInfoWindowTap
				);
				this.gestures.removeListener(this.infoWindow, 'tap');
				this.container.removeChild(this.infoWindow);
			} catch (e) {
				console.error(e);
			}
			this.infoWindow = null;
		}

		/**
		 * Check if the window wasn't opened again
		 * since the timeout was set.
		 */
		if (-1 == this.list.openedTiles.indexOf(this)) {
			this.element.removeCls('tile-opened');
		}
	},

	overlaps: function (tile) {
		var tolerance = 5;

		var posA = tile.infoWindowPos;
		var posB = this.infoWindowPos;
		var s = this.infoWindowSize - tolerance;

		return (
			((posA.left <= posB.left && posA.left + s >= posB.left) ||
				(posA.left >= posB.left && posA.left <= posB.left + s))
			&&
			((posA.top <= posB.top && posA.top + s >= posB.top) ||
				(posA.top >= posB.top && posA.top <= posB.top + s))
		);
	},

	setInfoWindowTimeout: function () {
		/* Close the window in N seconds. */
		if (this.infoWindowTimeout) {
			clearTimeout(this.infoWindowTimeout);
		}
		var self = this;
		this.infoWindowTimeout = setTimeout(function () {
			self.closeTile();
			self.infoWindowTimeout = null;
		}, this.infoWindowCloseDelay);
	},

	getTickersData: function () {
		if (window.tickersData) {
			var record = this.getRecord();
			var tickers = window.tickersData.filter(function (item) {
				return item._id == record.data.id;
			})[0];

			if (tickers) {
				return tickers;
			}
		}
		return null;
	},

	onTileTap: function (e) {
		if (this.list.openedTiles.indexOf(this) >= 0) {
			this.setInfoWindowTimeout();
			return;
		}

		var record = this.getRecord();

		if (!this.container) {
			this.container = this.element.dom.offsetParent;
		}

		record.data.tickersData = this.getTickersData();

		var infoWindow = this.infoTpl.append(
			this.container, record.data, true
		).dom;

		infoWindow.addEventListener('click', this.onInfoWindowTap, false);
		this.gestures.addListener(infoWindow, 'tap', this.onInfoWindowTap);

		this.gestures.dontPropagate(infoWindow, [
			'mousedown',
			'touchstart'
		]);

		var style = infoWindow.style;

		var w = this.infoWindowSize; //infoWindow.offsetWidth;
		var h = this.infoWindowSize; //infoWindow.offsetHeight;

		var centerX = Math.round(
			(this._position.x + this._size / 2) - w / 2
		);

		var centerY = Math.round(
			(this._position.y + this._size / 2) - h / 2
		);

		var positions = {
			'0': {
				left: centerX,
				top: this._position.y - h
			},
			'180': {
				left: centerX,
				top: this._position.y + this._size
			},
			'90': {
				left: this._position.x + this._size,
				top: centerY
			},
			'-90': {
				left: this._position.x - w,
				top: centerY
			}
		};

		var pos = positions[this._position.orientation];

		if (pos.left <= 0) {
			pos.left += this._size;
		} else if (pos.left + w - this._size >= this._position.maxX) {
			pos.left -= this._size;
		}

		if (pos.top <= 0) {
			pos.top += this._size;
		} else if (pos.top + h - this._size >= this._position.maxY) {
			pos.top -= this._size;
		}

		for (var key in pos) {
			style.setProperty(key, pos[key] + 'px');
		}

		style.setProperty(
			'-webkit-transform',
			'rotate(' + this._position.angle + 'deg)'
		);

		this.element.addCls('tile-opened');

		setTimeout(function () {
			style.setProperty('opacity', 1);
		}, 0);

		this.infoWindowPos = pos;

		/* Close and remove overlapping windows. */
		for (var i = this.list.openedTiles.length - 1; i >= 0; i -= 1) {
			var tile = this.list.openedTiles[i];
			if (this.overlaps(tile)) {
				this.closeTile(tile, i);
			}
		}

		this.infoWindow = infoWindow;
		this.list.openedTiles.push(this);
		this.setInfoWindowTimeout();
    },

	closeTile: function (tile, i) {
		var openedTiles = this.list.openedTiles;

		if (undefined === tile) {
			tile = this;
		}
		if (undefined === i) {
			i = openedTiles.indexOf(tile);
		}

		if (openedTiles[i]) {
			openedTiles.splice(i, 1);

			if (tile.infoWindow) {
				tile.infoWindow.style.setProperty('opacity', 0);

				setTimeout(function () {
					tile.removeInfoWindow();
				}, 300);
			}
		}
	}
});
