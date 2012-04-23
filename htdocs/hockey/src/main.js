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
		b2DebugDraw			= Box2D.Dynamics.b2DebugDraw,
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
				onPreSolve: Boolean
			};

			if (options) {
				Object.keys(options).forEach(function (key) {
					self.options[key] = options[key];
				});
			}

			this.options.ballRadius /= this.scale;

			this.canvas = canvas;
			this.width = canvas.width / this.scale;
			this.height = canvas.height / this.scale;

			this.destroyedBodies = [];

			var debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(canvas.getContext('2d'));
			debugDraw.SetDrawScale(this.scale);
			debugDraw.SetFillAlpha(0.5);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

			this.world = this.createWorld();
			this.world.SetDebugDraw(debugDraw);

			this.reset();

			this.bindCollision();
			this.bindMouse();
			this.startLoop();

			return this;
		},

		reset: function () {
			this.addWalls();
			this.addBalls();
		},

		startLoop: function () {
			var self = this;

			requestAnimationFrame(function frame() {
				self.drawWorld();

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
				this.world.CreateBody(bodyDef).CreateFixture(fixDef);
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

            this.world.CreateBody(bodyDef).CreateFixture(fixDef);

			return bodyDef;
		},

		createMembrane: function (pos, index) {
			var bodyDef = new b2BodyDef;
  
			var fixDef = new b2FixtureDef;
			fixDef.density = 1.0;
			fixDef.friction = 1;
			fixDef.restitution = 1;
       
			bodyDef.type = b2Body.b2_dynamicBody;
			fixDef.shape = new b2PolygonShape;
			fixDef.shape.SetAsBox(
				120 / 2 / this.scale,
				120 / 2 / this.scale
            );
			bodyDef.position.x = pos.x;
            bodyDef.position.y = pos.y;
			bodyDef.fixedRotation = true;
			bodyDef.userData = { index: index };

            this.world.CreateBody(bodyDef).CreateFixture(fixDef);

			return bodyDef;
		},

		destroyQueue: function () {
			while (this.destroyedBodies.length) {
				var body = this.destroyedBodies.shift();
				var pos = body.GetPosition();
				var data = body.GetUserData();

				if (b2Body.b2_staticBody === body.type) {
					this.createMembrane(pos, data.index);
				}

				this.world.DestroyBody(body);
			}
		},

		drawWorld: function () {
			this.updateMouse();
			this.destroyQueue();

            this.world.Step(this.FPS, 10, 10);
            this.world.DrawDebugData();
            this.world.ClearForces();
		},

		explode: function (body) {
			this.destroyedBodies.push(body);

			if (this.options.explosionSound) {
				this.options.explosionSound.src = this.options.explosionSound.src; // FIXME
				this.options.explosionSound.play();
			}
		},

		bindCollision: function () {
			var self = this;

			var contactListener = new b2ContactListener;

			contactListener.PreSolve = function (contact) {
				if ('b2PolyAndCircleContact' != contact.constructor.name) {
					return;
				}

				var fixture = contact.GetFixtureA();
				var body = fixture.GetBody();
				var data = body.GetUserData();

				var ballFix = contact.GetFixtureB();
				var ballBody = fixture.GetBody();

				if (null == data.index) {
					return;
				}

				var preventDefault = self.options.onPreSolve(data.index);

				if (preventDefault) {
					contact.SetEnabled(false);
					self.destroyedBodies.push(body);
					self.destroyedBodies.push(ballBody);
				}
			};


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
				document.removeEventListener('mousemove', handleMouseMove, true);
				isMouseDown = false;
				mouseX = undefined;
				mouseY = undefined;

				document.removeEventListener('mousedown', onMouseDown);
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

					if (body) {
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
		}
	};


	exports.initArcanoid = function (canvas, options) {
		return Object.create(Arcanoid).init(canvas, options);
	};
}(this, this));