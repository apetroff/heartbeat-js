/*
var TUIO = Object.create({
    listen: function (name, fn) {
		if (!this.handlers) {
			this.handlers = {};
		}

        if (!this.handlers[name]) {
            this.handlers[name] = [];
        }

        this.handlers[name].push(fn);
    },

    trigger: function (name, data) {
        var handlers = this.handlers[name];

        if (handlers) {
			var len = handlers.length;
            for (var i = 0; i < len; i += 1) {
                handlers[i].apply(null, data);
            }
        }
    }
});

TUIO.eventTypes = {
	'3': 'touchstart',
	'4': 'touchmove',
	'5': 'touchend'
};


function tuio_callback(type, sid, fid, x, y, angle)	{
	TUIO.trigger(
		TUIO.eventTypes[type],
		[ sid, fid, x, y, angle ]
	);
}
*/

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
		b2MouseJointDef		= Box2D.Dynamics.Joints.b2MouseJointDef,
		b2ContactListener	= Box2D.Dynamics.b2ContactListener;

	var requestAnimationFrame = globals.requestAnimationFrame ||
		globals.webkitRequestAnimationFrame;


	var Arcanoid = {
		FPS: 1 / 60,

		scale: 30,

		ballCount: 4,

		init: function (canvas, options) {
			var self = this;

			this.options = {
				ballRadius: 60,
				springRatio: 5,
				explosionDuration: 10,
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
			this.bindMouse();
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

			var w = 120 / 2 / this.scale;
			var h = 120 / 2 / this.scale;

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
			fixDef.shape = new b2CircleShape(
				this.ballRadius
            );
			bodyDef.position.x = x;
            bodyDef.position.y = y;
			bodyDef.userData = { index: index };

            var body = this.world.CreateBody(bodyDef);
			body.CreateFixture(fixDef);

			return body;
		},

		destroyOffScreen: function () {
			var self = this;

			var ballKeys = Object.keys(this.balls);

			if (!ballKeys.length) {
				this.reset();
				return;
			}

			ballKeys.forEach(function (i) {
				var ball = self.balls[i];
				var pos = ball.GetPosition();
				var r = self.ballRadius;

				if (
					pos.x - r < 0 ||
					pos.y - r < 0 ||
					pos.x + r > self.width ||
					pos.y + r > self.height
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
			this.updateMouse();
			this.destroyOffScreen();

			this.destroyQueue();

			this.clearWorld();

            this.world.Step(this.FPS, 10, 10);
            this.world.ClearForces();

			this.drawWorld();
		},

		explode: function (body) {
			this.explosionFrame = this.options.explosionDuration;
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

			this.mouseX = {};
			this.mouseY = {};
			this.mouseBodies = {};

			var mousePVec, selectedBody;

			var canvasPos = this.canvas.getBoundingClientRect();

			document.addEventListener('touchstart', onMouseDown);
			document.addEventListener('touchend',   onMouseUp);
			document.addEventListener('touchmove',  onMouseMove);

			function onMouseDown(e) {
				for (var i = 0; i < e.targetTouches.length; i += 1) {
					var finger = e.targetTouches[i];
					var id = finger.identifier;

					self.mouseX[id] = (finger.pageX - canvasPos.left) / self.scale;
					self.mouseY[id] = (finger.pageY - canvasPos.top) / self.scale;

					var body = getBodyAtMouse(id);

					if (body) {
						console.log(id);
						self.mouseBodies[id] = getBodyAtMouse(id);
					}
				}
			};

			function onMouseMove(e) {
				for (var i = 0; i < e.changedTouches.length; i += 1) {
					var finger = e.changedTouches[i];
					var id = finger.identifier;

					if (id in self.mouseBodies) {
						self.mouseX[id] = (finger.pageX - canvasPos.left) / self.scale;
						self.mouseY[id] = (finger.pageY - canvasPos.top) / self.scale;
					}
				}
			}

			function onMouseUp(e) {
				var MIN_DX = 14;
				var MIN_DY = 9;

				for (var i = 0; i < e.changedTouches.length; i += 1) {
					var finger = e.changedTouches[i];
					var id = finger.identifier;
					var body = self.mouseBodies[id];

					if (body) {
						var pos = body.GetPosition();
						var r = self.options.springRatio;

						var dX = (self.mouseX[id] - pos.x) * r;
						var dY = (self.mouseY[id] - pos.y) * r;

						if (dX < MIN_DX && dY < MIN_DY) {
							dX = (dX + 1) * 4;
							dY = (dY + 1) * 4;
						}

						body.SetLinearVelocity(new b2Vec2(dX, dY));
						body.SetAwake(true);

						delete self.mouseX[id];
						delete self.mouseY[id];
						delete self.mouseBodies[id];
					}
				}
			}

			function getBodyAtMouse(id) {
				mousePVec = new b2Vec2(self.mouseX[id], self.mouseY[id]);
				var aabb = new b2AABB();
				aabb.lowerBound.Set(self.mouseX[id] - 0.001, self.mouseY[id] - 0.001);
				aabb.upperBound.Set(self.mouseX[id] + 0.001, self.mouseY[id] + 0.001);

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

			this.updateMouse = function () {
				var ids = Object.keys(this.mouseBodies);

				for (var i = 0; i < ids.length; i += 1) {
					var id = ids[i];
					var body = this.mouseBodies[id];
					var data = body.GetUserData();
				}
			};
		},

		clearWorld: function () {
			var $ = this.scale;
			this.ctx.clearRect(0, 0, this.width * $, this.height * $);
		},

		drawCircle: function (ball) {
			var $ = this.scale;
			var PIx2 = Math.PI * 2;
			var r = this.options.ballRadius;

			var images = [
				'/hockey/a/bird.png',
				'/hockey/a/rio.png',
				'/hockey/a/green.png',
				'/hockey/a/yellow.png'
			].map(function (src) {
				var img = new Image;
				img.src = src;
				return img;
			});

			this.drawCircle = function (ball) {
				var pos = ball.GetPosition();
				var index = ball.GetUserData().index;
				var angle = ball.GetAngle();

				this.ctx.save();
				if (angle) {
					this.ctx.translate(pos.x * $, pos.y * $);
					this.ctx.rotate(angle);
					this.ctx.translate(-pos.x * $, -pos.y * $);
				}
				this.ctx.drawImage(
					images[index],
					pos.x * $ - r, pos.y * $ - r
				);
				this.ctx.restore();
			};

			return this.drawCircle(ball);
		},

		drawWorld: function () {
			var $ = this.scale;

			if (this.explosionFrame > 0) {
				this.explosionFrame -= 1;

				var pos = this.explosionPosition;
				var r = ~~(this.explosionFrame * this.ballRadius * 10);

				this.ctx.beginPath();
				this.ctx.arc(
					~~(pos.x * $),
					~~(pos.y * $),
					r, 0, Math.PI * 2, false
				);
				this.ctx.closePath();
				var red = ~~(255 - this.explosionFrame);
				this.ctx.fillStyle = 'rgba(' + red + ', 50, 50, 0.5)';				
				this.ctx.fill();
			}

			for (var i in this.balls) {
				this.drawCircle(this.balls[i]);
			}

			for (var id in this.mouseX) {
				var body = this.mouseBodies[id];

				if (body) {
					var bodyPos = body.GetPosition();

					this.ctx.beginPath();
					this.ctx.moveTo(
						~~(this.mouseX[id] * $),
						~~(this.mouseY[id] * $)
					);
					this.ctx.lineTo(
						~~(bodyPos.x * $),
						~~(bodyPos.y * $)
					);
					this.ctx.stroke();
					this.ctx.closePath();
				}
			}
		}
	};


	exports.initArcanoid = function (canvas, options) {
		return Object.create(Arcanoid).init(canvas, options);
	};
}(this, this));