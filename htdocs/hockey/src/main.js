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
			this.collisions = {};
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
			var world = new b2World(
				// gravity
               new b2Vec2(0, 0),
			   // allow sleep
               false
			);
		    
			var fixDef = new b2FixtureDef;
			fixDef.density = 1.0;
			fixDef.friction = 0;
			fixDef.restitution = 1.1;
         
			var bodyDef = new b2BodyDef;

			var borderW = 0;
			var one = 0 / this.scale;

			//create ground
			bodyDef.type = b2Body.b2_staticBody;
			fixDef.shape = new b2PolygonShape;

			/* |  | */
			fixDef.shape.SetAsBox(borderW, this.height + one * 2);

			bodyDef.position.Set(-one, this.height + one);
			world.CreateBody(bodyDef).CreateFixture(fixDef);

			bodyDef.position.Set(this.width + one, this.height + one);
			world.CreateBody(bodyDef).CreateFixture(fixDef);

			/* _ - */
			fixDef.shape.SetAsBox(this.width + one * 2, borderW);

			bodyDef.position.Set(-one, -one);
			world.CreateBody(bodyDef).CreateFixture(fixDef);

			bodyDef.position.Set(-one, this.height + one);
			world.CreateBody(bodyDef).CreateFixture(fixDef);

			return world;
		},

		addBalls: function () {
			this.balls = [];

			var offset = 13 / this.scale;

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

            this.world.CreateBody(bodyDef).CreateFixture(fixDef);

			return bodyDef;
		},

		drawWorld: function () {
			this.updateMouse();

            this.world.Step(this.FPS, 10, 10);
            this.world.DrawDebugData();
            this.world.ClearForces();
		},

		explode: function (pos) {
			if (this.options.explosionSound) {
				this.options.explosionSound.src = this.options.explosionSound.src; // FIXME
				this.options.explosionSound.play();
			}
		},

		getContactPoint: function (contact) {
			var contactPoints = contact.GetManifold();
			var firstPoint = contactPoints.m_points[0].m_localPoint;
			var fixture = contact.GetFixtureB();
			var body = fixture.GetBody();
			var pos = body.GetWorldPoint(firstPoint);

			return {
				x: ~~(pos.x * this.scale),
				y: ~~(pos.y * this.scale),
				body: body,
				fixture: fixture
			};
		},

		bindCollision: function () {
			var self = this;

			var contactListener = new b2ContactListener;

			contactListener.PreSolve = function (contact) {
				if ('b2PolyAndCircleContact' != contact.constructor.name) {
					return;
				}

				var point = self.getContactPoint(contact);

				var preventDefault = self.options.onPreSolve(point, self);

				if (preventDefault) {
					contact.SetEnabled(false);

					setTimeout(function () {
						point.body.SetAwake(false);
						point.body.DestroyFixture(point.fixture);
						self.world.DestroyBody(point.body);
					}, 3000);
				}
			};

			contactListener.EndContact = function (contact) {
				if ('b2PolyAndCircleContact' != contact.constructor.name) {
					return;
				}

				var point = self.getContactPoint(contact);

				var explode = self.options.onEndContact(point, self);

				if (explode) {
					self.explode(point);
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