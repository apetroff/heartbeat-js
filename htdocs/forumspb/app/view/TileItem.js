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
			'<span>&mdash;{[~~(Math.random() * 20)]}%</span>',
		'</div></div>'
	).compile(),

	infoWindowSize: 360,

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
	},

	_hide: function () {
		this.element.hide();
		this.removeInfoWindow();
	},

	_show: function () {
		this.element.show();
	},

	removeInfoWindow: function () {
		if (this.container) {
			this.container.removeChild(this.infoWindow);
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

	onTileTap: function (e) {
		if (this.list.openedTiles.indexOf(this) >= 0) {
			return;
		}

		var record = this.getRecord();

		this.container = this.element.dom.offsetParent;

		var infoWindow = this.infoTpl.append(
			this.container, record.data, true
		).dom;

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
			(function (tile, i, openedTiles, self) {
				if (self.overlaps(tile)) {
					openedTiles.splice(i, 1);

					var tW = tile.infoWindow;
					if (tW) {
						tW.style.setProperty('opacity', 0);

						setTimeout(function () {
							tile.removeInfoWindow();

							if (-1 == openedTiles.indexOf(tile)) {
								tile.element.removeCls('tile-opened');
							}
						}, 300);
					}
				}
			}(this.list.openedTiles[i], i, this.list.openedTiles, this));
		}

		this.infoWindow = infoWindow;
		this.list.openedTiles.push(this);
    }
});
