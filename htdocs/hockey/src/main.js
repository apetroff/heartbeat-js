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
				onEndContact: Boolean,
				onReset: Boolean
			};

			if (options) {
				Object.keys(options).forEach(function (key) {
					self.options[key] = options[key];
				});
			}

			this.options.ballRadius /= this.scale;

			this.canvas = canvas;
			this.ctx = canvas.getContext('2d');
			this.width = canvas.width / this.scale;
			this.height = canvas.height / this.scale;

			this.destroyedBodies = [];
			this.movingBalls = [];
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
			this.movingBalls.length = 0;

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
			});
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
			var wallKeys = Object.keys(this.walls);
			wallKeys.forEach(function (i) {
				var wall = self.walls[i];
				delete self.walls[i];
				self.destroyedBodies.push(wall);
			});
		},

		addWalls: function () {
			var fixDef = new b2FixtureDef;
			fixDef.density = 1.0;
			fixDef.friction = 0.5;
			fixDef.restitution = 0.2;
			
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
					(this.options.ballRadius + offset) * (i % 2 ? -1 : 1);
				var y = this.height * (i > 1) +
					(this.options.ballRadius + offset) * (i > 1 ? -1 : 1);
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
				this.options.ballRadius
            );
			bodyDef.position.x = x;
            bodyDef.position.y = y;
			bodyDef.fixedRotation = true;

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
				var r = self.options.ballRadius;

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
			var pos = body.GetPosition();

			this.destroyedBodies.push(body);

			if (this.options.explosionSound) {
				this.options.explosionSound.src = this.options.explosionSound.src; // FIXME
				this.options.explosionSound.play();
			}
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

				if (explode) {
					delete self.walls[data.index];
					self.explode(body);
				}
			};

			this.world.SetContactListener(contactListener);
		},

		bindMouse: function () {
			var self = this;

			var mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint;
			var canvasPosition = this.canvas.getBoundingClientRect();

			document.addEventListener('mousedown', onMouseDown, true);
			document.addEventListener('mouseup', onMouseUp, true);

			function onMouseUp() {
				isMouseDown = false;
				mouseX = undefined;
				mouseY = undefined;
			}

			function onMouseDown(e) {
				isMouseDown = true;
				handleMouseMove(e);
				document.addEventListener('mousemove', handleMouseMove, true);
			};

			function handleMouseMove(e) {
				mouseX = (e.clientX - canvasPosition.left) / self.scale;
				mouseY = (e.clientY - canvasPosition.top) / self.scale;
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

			this.updateMouse = function () {
				if (isMouseDown && !mouseJoint) {
					var body = getBodyAtMouse();

					if (body && self.movingBalls.indexOf(body) == -1) {
						self.movingBalls.push(body);

						var md = new b2MouseJointDef();
						md.bodyA = this.world.GetGroundBody();
						md.bodyB = body;
						md.target.Set(mouseX, mouseY);
						md.collideConnected = true;
						md.maxForce = 300.0 * body.GetMass();
						mouseJoint = self.world.CreateJoint(md);
						body.SetAwake(true);
					}
				}
				
				if (mouseJoint) {
					if (isMouseDown) {
						mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
					} else {
						self.world.DestroyJoint(mouseJoint);
						mouseJoint = null;
					}
				}
			};
		},

		clearWorld: function () {
			var $ = this.scale;
			this.ctx.clearRect(0, 0, this.width * $, this.height * $);

			/*
			var self = this;
			var r = this.options.ballRadius * $;

			Object.keys(this.balls).forEach(function (i) {
				var ball = self.balls[i];
				var pos = ball.GetPosition();

				self.ctx.clearRect(
					pos.x * $ - r,
					pos.y * $ - r,
					r * 2,
					r * 2
				);
			});
			*/
		},

		drawCircle: function (pos) {
			var $ = this.scale;
			var PIx2 = Math.PI * 2;
			var r = this.options.ballRadius * $;

			this.drawCircle = function (pos) {
				this.ctx.beginPath();
				this.ctx.arc(
					pos.x * $, pos.y * $,
					r, 0, PIx2, false
				);
				this.ctx.stroke();
			};

			return this.drawCircle(pos);
		},

		drawWorld: function () {
			var self = this;
			Object.keys(this.balls).forEach(function (i) {
				var ball = self.balls[i];
				self.drawCircle(ball.GetPosition());
			});
		}
	};


	exports.initArcanoid = function (canvas, options) {
		return Object.create(Arcanoid).init(canvas, options);
	};
}(this, this));