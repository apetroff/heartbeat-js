(function (globals, exports) {
	'use strict';

	var Box2D = globals.Box2D;

	var b2Vec2				= Box2D.Common.Math.b2Vec2,
		b2AABB				= Box2D.Collision.b2AABB,
		b2BodyDef			= Box2D.Dynamics.b2BodyDef,
		b2Body				= Box2D.Dynamics.b2Body,
		b2FixtureDef		= Box2D.Dynamics.b2FixtureDef,
		b2Fixture			= Box2D.Dynamics.b2Fixture,
		b2World				= Box2D.Dynamics.b2World,
		b2MassData			= Box2D.Collision.Shapes.b2MassData,
		b2PolygonShape		= Box2D.Collision.Shapes.b2PolygonShape,
		b2CircleShape		= Box2D.Collision.Shapes.b2CircleShape,
		b2TouchJointDef		= Box2D.Dynamics.Joints.b2TouchJointDef,
		b2ContactListener	= Box2D.Dynamics.b2ContactListener;

	var requestAnimationFrame = globals.requestAnimationFrame ||
		globals.webkitRequestAnimationFrame;


	var Hockey = {
		FPS: 1 / 60,

		scale: 30,

		ballCount: 4,

		colorTpl: new Ext.XTemplate(
			'hsla({h}, {s}%, {v}%, {a})'
		).compile(),

		init: function (canvas, options) {
			var self = this;

			this.options = {
				ballRadius: 40,
				ballHitpoints: 4,
				squareSize: 120,
				springCoef: 1000,
				onEndContact: Boolean,
				onReset: Boolean
			};

			if (options) {
				Object.keys(options).forEach(function (key) {
					self.options[key] = options[key];
				});
			}

			this.ballRadius = this.options.ballRadius / this.scale;

			this.canvas = canvas;
			this.ctx = canvas.getContext('2d');
			this.width = canvas.width / this.scale;
			this.height = canvas.height / this.scale;

			this.destroyedBodies = [];
			this.walls = {};
			this.balls = {};

			this.world = this.createWorld();

			this.reset();

			this.bindCollision();

			this.bindTouch();
			this.bindMouse();

			this.initBackground();

			this.startLoop();

			return this;
		},

		reset: function () {
			this.removeWalls();
			this.addWalls();
			this.addBalls();
			this.options.onReset();
		},

		startLoop: function () {
			var self = this;
			requestAnimationFrame(function frame() {
				self.step();
				requestAnimationFrame(frame);
			}, this.canvas);
		},

		createWorld: function () {			       
			return new b2World(
				// gravity
               new b2Vec2(0, 0),
			   // allow sleep
               false
			);
		},

		removeWalls: function () {
			var self = this;
			for (var i in this.walls) {
				var wall = this.walls[i];
				delete this.walls[i];
				this.destroyedBodies.push(wall);
			}
		},

		addWalls: function () {
			var fixDef = new b2FixtureDef;
			fixDef.density = 1.0;
			fixDef.friction = 1;
			fixDef.restitution = 1;
			
			var bodyDef = new b2BodyDef;

			var w = this.options.squareSize / 2 / this.scale;
			var h = this.options.squareSize / 2 / this.scale;

			var nX = 14;
			var nY = 7;
			
			bodyDef.type = b2Body.b2_staticBody;
			
			fixDef.shape = new b2PolygonShape;
			fixDef.shape.SetAsBox(w, h);

			var index = 0;

			var tl = nX + 1 + nY + 1 + nX + 1 + nY + 1; // 46
			var bl = nX + 1 + nY + 1 + nX + 1;          // 38
			var br = nX + 1 + nY + 1;                   // 23
			var tr = nX + 1;                            // 15

			for (var i = 1; i < tl; i += 1) {
				// corners
				if (i == tr || i == br || i == bl) {
					continue;
				}

				if (i < tr) {
					bodyDef.position.Set((i + 0.5) * w * 2, h);
				} else if (i < br) {
					bodyDef.position.Set((tr + 0.5) * w * 2, (-((br - i) - (nY + 1)) + 0.5) * h * 2);
				} else if (i < bl) {
					bodyDef.position.Set((bl - i + 0.5) * 2 * 2, (nY + 1 + 0.5) * h * 2);
				} else {
					bodyDef.position.Set(w, (tl - i + 0.5) * h * 2);
				}

				bodyDef.userData = { index: index };
				var wall = this.world.CreateBody(bodyDef);
				wall.CreateFixture(fixDef);
				this.walls[index] = wall;
				index += 1;
			}
		},

		addBalls: function () {
			var offset = 135 / this.scale;

			for (var i = 0; i < this.ballCount; i += 1) {
				var x = this.width * (i % 2) +
					(this.ballRadius + offset) * (i % 2 ? -1 : 1);
				var y = this.height * (i > 1) +
					(this.ballRadius + offset) * (i > 1 ? -1 : 1);
				var ball = this.createBall(i, x, y);

				this.balls[i] = ball;
			}
		},

		createBall: function (index, x, y) {
			var bodyDef = new b2BodyDef;
  
			var fixDef = new b2FixtureDef;
			fixDef.density = 1.0;
			fixDef.friction = 1;
			fixDef.restitution = 1;
       
			bodyDef.type = b2Body.b2_dynamicBody;
			fixDef.shape = new b2CircleShape(this.ballRadius);
			bodyDef.position.x = x;
            bodyDef.position.y = y;
			bodyDef.userData = {
				index: index,
				hitpoints: this.options.ballHitpoints,
				radius: this.ballRadius,
				color: [ 'red', 'blue', 'yellow', 'purple' ][index % 4]
			};

            var body = this.world.CreateBody(bodyDef);
			body.CreateFixture(fixDef);

			return body;
		},

		destroyBalls: function () {
			var self = this;

			var ballKeys = Object.keys(this.balls);

			if (!ballKeys.length) {
				if (!this.resetTimeout) {
					this.resetTimeout = setTimeout(function () {
						self.resetTimeout = null;
						self.reset();
					}, 3000);
				}
				return;
			}

			ballKeys.forEach(function (i) {
				var ball = self.balls[i];
				var data = ball.GetUserData();
				var pos = ball.GetPosition();
				var r = data.radius;

				if (
					data.hitpoints <= 0 || (
						pos.x - r < 0 ||
						pos.y - r < 0 ||
						pos.x + r > self.width ||
						pos.y + r > self.height
					)
				) {
					ball.SetAwake(false);
					self.destroyedBodies.push(ball);
					delete self.balls[i];
				}
			});
		},

		destroyQueue: function () {
			while (this.destroyedBodies.length) {
				var body = this.destroyedBodies.shift();
				this.world.DestroyBody(body);
			}
		},

		step: function () {
			this.destroyBalls();

			this.destroyQueue();

			this.clearWorld();

            this.world.Step(this.FPS, 10, 10);
            this.world.ClearForces();

			this.drawWorld();
		},

		explode: function (body) {
			this.explosionFrame = Math.PI;
			this.explosionPosition = body.GetPosition();

			/*
			if (this.options.explosionSound) {
				this.options.explosionSound.src = this.options.explosionSound.src; // FIXME
				this.options.explosionSound.play();
			}
			*/
		},

		bindCollision: function () {
			var self = this;

			var contactListener = new b2ContactListener;

			contactListener.EndContact = function (contact) {
				if ('b2PolyAndCircleContact' != contact.constructor.name) {
					return;
				}

				var fixture = contact.GetFixtureA();
				var body = fixture.GetBody();
				var data = body.GetUserData();

				if (null == data.index) {
					return;
				}

				var ballFix = contact.GetFixtureB();
				var ball = ballFix.GetBody();
				var ballData = ball.GetUserData();

				ballData.hitpoints -= 1;

				if (ballData.hitpoints > 0) {
					ballData.radius = ballData.hitpoints *
						(self.ballRadius / self.options.ballHitpoints);
					ball.GetFixtureList().GetShape().SetRadius(ballData.radius);
				}

				var explode = self.options.onEndContact(data.index);

				if (explode && data.index in self.walls) {
					self.explode(body);

					setTimeout(function () {
						self.destroyedBodies.push(body);
						delete self.walls[data.index];
					}, 100);
				}
			};

			this.world.SetContactListener(contactListener);
		},

		bindMouse: function () {
 			var self = this;

			var mouseX, mouseY, mouseStart, mouseBody;
			var mousePVec, selectedBody;

			var canvasPos = this.canvas.getBoundingClientRect();

			document.addEventListener('mousedown', onMouseDown);
			document.addEventListener('mouseup',   onMouseUp);
			document.addEventListener('mousemove', onMouseMove);

			function onMouseDown(e) {
				mouseX = (e.clientX - canvasPos.left) / self.scale;
				mouseY = (e.clientY - canvasPos.top) / self.scale;
				mouseBody = getBodyAtMouse();
			};

			function onMouseMove(e) {
				if (mouseBody) {
					mouseX = (e.clientX - canvasPos.left) / self.scale;
					mouseY = (e.clientY - canvasPos.top) / self.scale;

					if (!mouseStart) {
						mouseStart = Date.now();
					}
				}
			}

			function onMouseUp(e) {
				var MIN_DX = 14;
				var MIN_DY = 9;

				if (mouseBody) {
					var pos = mouseBody.GetPosition();
					var k = self.options.springCoef;
					var dT = 1 / (Date.now() - mouseStart);

					var dX = (mouseX - pos.x) * dT * k;
					var dY = (mouseY - pos.y) * dT * k;

					if (Math.abs(dX) >= MIN_DX && Math.abs(dY) >= MIN_DY) {
						mouseBody.SetLinearVelocity(new b2Vec2(dX, dY));
						mouseBody.SetAwake(true);
					}

					mouseX = null;
					mouseY = null;
					mouseStart = null;
					mouseBody = null;
				}
			}

			function getBodyAtMouse() {
				mousePVec = new b2Vec2(mouseX, mouseY);
				var aabb = new b2AABB();
				aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
				aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);

				// Query the world for overlapping shapes.
				selectedBody = null;
				self.world.QueryAABB(getBodyCB, aabb);
				return selectedBody;
			}

			function getBodyCB(fixture) {
				if (fixture.GetBody().GetType() != b2Body.b2_staticBody) {
					var transform = fixture.GetBody().GetTransform();
					if (fixture.GetShape().TestPoint(transform, mousePVec)) {
						selectedBody = fixture.GetBody();
						return false;
					}
				}
				return true;
			}
		},

		bindTouch: function () {
 			var self = this;

			this.touchX = {};
			this.touchY = {};
			this.touchStart = {};
			this.touchBodies = {};

			var touchPVec, selectedBody;

			var canvasPos = this.canvas.getBoundingClientRect();

			document.addEventListener('touchstart', onTouchDown);
			document.addEventListener('touchend',   onTouchUp);
			document.addEventListener('touchmove',  onTouchMove);

			function onTouchDown(e) {
				for (var i = 0; i < e.targetTouches.length; i += 1) {
					var finger = e.targetTouches[i];
					var id = finger.identifier;

					self.touchX[id] = (finger.pageX - canvasPos.left) / self.scale;
					self.touchY[id] = (finger.pageY - canvasPos.top) / self.scale;

					var body = getBodyAtTouch(id);

					if (body) {
						self.touchBodies[id] = getBodyAtTouch(id);
					}
				}
			};

			function onTouchMove(e) {
				for (var i = 0; i < e.changedTouches.length; i += 1) {
					var finger = e.changedTouches[i];
					var id = finger.identifier;

					if (id in self.touchBodies) {
						self.touchX[id] = (finger.pageX - canvasPos.left) / self.scale;
						self.touchY[id] = (finger.pageY - canvasPos.top) / self.scale;

						if (!(id in self.touchStart)) {
							self.touchStart[id] = Date.now();
						}
					}
				}
			}

			function onTouchUp(e) {
				var MIN_DX = 14;
				var MIN_DY = 9;

				for (var i = 0; i < e.changedTouches.length; i += 1) {
					var finger = e.changedTouches[i];
					var id = finger.identifier;
					var body = self.touchBodies[id];

					if (body) {
						var pos = body.GetPosition();
						var k = self.options.springCoef;
						var dT = 1 / (Date.now() - self.touchStart[id]);

						var dX = (self.touchX[id] - pos.x) * dT * k;
						var dY = (self.touchY[id] - pos.y) * dT * k;

						delete self.touchX[id];
						delete self.touchY[id];
						delete self.touchStart[id];
						delete self.touchBodies[id];

						if (Math.abs(dX) >= MIN_DX && Math.abs(dY) >= MIN_DY) {
							body.SetLinearVelocity(new b2Vec2(dX, dY));
							body.SetAwake(true);
						}
					}
				}
			}

			function getBodyAtTouch(id) {
				touchPVec = new b2Vec2(self.touchX[id], self.touchY[id]);
				var aabb = new b2AABB();
				aabb.lowerBound.Set(self.touchX[id] - 0.001, self.touchY[id] - 0.001);
				aabb.upperBound.Set(self.touchX[id] + 0.001, self.touchY[id] + 0.001);

				// Query the world for overlapping shapes.
				selectedBody = null;
				self.world.QueryAABB(getBodyCB, aabb);
				return selectedBody;
			}

			function getBodyCB(fixture) {
				if (fixture.GetBody().GetType() != b2Body.b2_staticBody) {
					var transform = fixture.GetBody().GetTransform();
					if (fixture.GetShape().TestPoint(transform, touchPVec)) {
						selectedBody = fixture.GetBody();
						return false;
					}
				}
				return true;
			}
		},

		clearWorld: function () {
			var $ = this.scale;
			this.ctx.clearRect(0, 0, this.width * $, this.height * $);
		},

		drawCircle: function (ball) {
			var data = ball.GetUserData();
			var $ = this.scale;
			var pos = ball.GetPosition();
			var index = data.index;
			var angle = ball.GetAngle();

			this.ctx.save();
			if (angle) {
				this.ctx.translate(pos.x * $, pos.y * $);
				this.ctx.rotate(angle);
				this.ctx.translate(-pos.x * $, -pos.y * $);
			}

			this.ctx.beginPath();
			this.ctx.arc(
				pos.x * $, pos.y * $,
				data.radius * $,
				0, Math.PI * 2, true
			);
			this.ctx.closePath();

			//this.ctx.fillStyle = this.colorTpl.apply(data.color);
			this.ctx.fillStyle = data.color;
			this.ctx.strokeStyle = '#999';
			this.ctx.fill();
			this.ctx.stroke();
			this.ctx.restore();
		},


		overlaps: function (posA, posB) {
			var t = 5;

			return (
				((posA.x <= posB.x && posA.x + posA.w - t >= posB.x) ||
				 (posA.x >= posB.x && posA.x <= posB.x + posB.w - t))
					&&
				((posA.y <= posB.y && posA.y + posA.h - t >= posB.y) ||
				 (posA.y >= posB.y && posA.y <= posB.y + posB.h - t))
			);
		},

		drawWorld: function () {
			var $ = this.scale;

			this.squares.forEach(this.drawSquare);

			if (this.explosionFrame > 0) {
				this.explosionFrame -= 0.4;

				var numSquares = 4;
				var pos = this.explosionPosition;
				var k = Math.sin(this.explosionFrame);
				var r = this.options.squareSize * numSquares * k / 2;

				this.explosionRect = {
					x: ~~(pos.x * $ - r),
					y: ~~(pos.y * $ - r),
					w: ~~(r * 2),
					h: ~~(r * 2),
					color: this.colors[~~(Math.random() * 3)]
				};
			} else {
				this.explosionRect = null;
			}

			for (var i in this.balls) {
				this.drawCircle(this.balls[i]);
			}

			for (var id in this.touchX) {
				var body = this.touchBodies[id];

				if (body) {
					var bodyPos = body.GetPosition();

					this.ctx.beginPath();
					this.ctx.moveTo(
						~~(this.touchX[id] * $),
						~~(this.touchY[id] * $)
					);
					this.ctx.lineTo(
						~~(bodyPos.x * $),
						~~(bodyPos.y * $)
					);
					this.ctx.stroke();
					this.ctx.closePath();
				}
			}
		},

		initBackground: function () {
			var w = this.canvas.width;
			var h = this.canvas.height;

			this.colors = [
				{ h: 216, s: 23, v: 80, a: 1 }, // blue
				{ h: 323, s: 30, v: 80, a: 1 }, // red
				{ h: 264, s: 11, v: 80, a: 1 }, // purple
				{ h: 0,   s: 0,  v: 80, a: 0 }  // transparent
			];

			var rW = this.options.squareSize, rH = rW;

			this.squares = [];
			for (var x = 0; x < w; x += rW) {
				for (var y = 0; y < h; y += rH) {
					var color = this.randColor();
					this.squares.push({
						x: x,
						y: y,
						w: rW,
						h: rH,
						lum: 100 + ~~(Math.random() * (color.v - 100)),
						color: color
					});
				}
			}

			/* Bind drawSquare. */
			var drawSquare = this.drawSquare;
			var self = this;
			this.drawSquare = function (square) {
				drawSquare.call(self, square);
			};
		},

		randColor: function () {
			return this.colors[~~(Math.random() * this.colors.length)];
		},

		drawSquare: function (square) {
			var speed = 0.1;

			if (square.lum > 100) {
				square.color = this.randColor();
				square.flip = true;
			} else if (square.lum < square.color.v) {
				square.lum = square.color.v; // min luminosity
				square.flip = false;
			}

			square.lum += speed * (square.flip ? -1 : 1);

			var color = square.color;
			var lum = square.lum;
			if (
				this.explosionRect &&
				this.overlaps(this.explosionRect, square)
			) {
				color = this.explosionRect.color;
				square.lum = 95;
				lum = 60 + 10 * ~~(
					this.explosionRect.w / this.options.squareSize
				);
			}

			this.ctx.fillStyle = this.colorTpl.apply({
				h: color.h,
				s: color.s + '%',
				v: lum + '%',
				a: color.a
			});
			this.ctx.fillRect(
				square.x, square.y,
				square.w, square.h
			);
		}
	};

	exports.initHockey = function (canvas, options) {
		return Object.create(Hockey).init(canvas, options);
	};
}(this, this));