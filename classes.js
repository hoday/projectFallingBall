

		var ShapeEnum = {
			BALL  : 0,
			STICK : 1,
			BOX   : 2
		};

		class Vector2
		{
			constructor(x, y)
			{
				this.x = x;
				this.y = y;	
			}
			
			static distance(a, b)
			{
				const dx = a.x - b.x;
				const dy = a.y - b.y;

				return Math.hypot(dx, dy);
			}
			
			add(b)
			{
				this.x += b.x;
				this.y += b.y;

				return this;				
			}
			
			subtract(b)
			{
				this.x -= b.x;
				this.y -= b.y;
				return this;
			}
			
			scale(s)
			{
				this.x *= s;
				this.y *= s;
				return this;
			}
			
			negate()
			{
				this.x = -this.x;
				this.y = -this.y;
				return this;
			}
		
		}
		
		class Point
		{
			constructor(pos)
			{
				this.x = pos.x;
				this.y = pos.y;	
			}
		
			draw()
			{
				context.fillStyle = colorPoint;
				context.beginPath();
				context.arc(this.x*pixelsPerMeter, this.y*pixelsPerMeter, radiusPoint, 0, Math.PI*2);
				context.fill();
				context.closePath();				
			}		
		
		}
		
		
		class StateFactory
		{
			static getState(x, y, vx, vy, name)
			{
				var state;
				if (stateType === "normal")
				{
					state = new State1(x, y, vx, vy, name);
				} 
				else 
				{
					state = new State2(x, y, vx, vy, name);
				}
				return state;
				
			}
			
		}
		
		class State
		{
			constructor(name)
			{
				this.name = name;
							
			}	
			
		}
		
		
		
		
		class State1 extends State
		{
			constructor(x, y, vx, vy, name)
			{
				super(name);
				this.pos = new Vector2(x, y);
				this.vel = new Vector2(vx, vy);
				this.acc = new Vector2(0, a);
				console.log("new state1 instantiated: " + this.name + " : ");
				console.log(this.toString());

				}		
			
			update()
			{
				
				this.pos.y = this.pos.y + this.vel.y*t + 0.5*this.acc.y*t*t;
				this.vel.y = this.vel.y + this.acc.y*t;
				this.pos.x = this.pos.x + this.vel.x*t + 0.5*this.acc.x*t*t;
				this.vel.x = this.vel.x + this.acc.x*t;					
				

				//this.satisfyConstraint();
				console.log("state updated: " + this.name + " : ");
				console.log(this.toString());
			}
			
			getPos()
			{
				return new Point(this.pos);
			}
			
			getVel()
			{
				return this.vel;
			}
			
			getAcc()
			{
				return this.acc;
				
			}
			
			setPos(x, y)
			{
				this.pos = new Vector2(x, y);				
			}
			
			setVel(vx, vy)
			{
				this.vel = new Vector2(vx, vy);				
			}
			
			toString()
			{
				return ("state1: " + this.name + " : ") + '\n' +
				("current pos: " + this.getPos().x.toFixed(1) + ", " + this.getPos().y.toFixed(1))  + '\n' +
				("vel        : " + this.getVel().x.toFixed(1) + ", " + this.getVel().y.toFixed(1))  + '\n' +
				("acc        : " + this.getAcc().x.toFixed(1) + ", " + this.getAcc().y.toFixed(1));
				
			}
			
			
		}

		
		
		class State2 extends State
		{
			constructor(x, y, vx, vy, name)
			{
				super(name);
				this.pos     = new Vector2(x, y);
				this.posPrev = new Vector2(x - vx*t, y - vy*t);
				this.acc     = new Vector2(0, a);
				console.log("new state2 instantiated: " + this.name + " : ");
				console.log(this.toString());

				}		
			
			update()
			{
				var tempy = this.pos.y;
				var tempx = this.pos.x;
				
				this.pos.y += (this.pos.y - this.posPrev.y) + 0.5*this.acc.y*t*t;
				this.posPrev.y = tempy;
				this.pos.x += (this.pos.x - this.posPrev.x) + 0.5*this.acc.x*t*t;
				this.posPrev.x = tempx;					
				

				//this.satisfyConstraint();
				console.log("state updated: " + this.name + " : ");
				console.log(this.toString());
			}
			
			getPos()
			{
				return new Point(this.pos);
			}
			
			getVel()
			{
				return new Vector2((this.pos.x - this.posPrev.x)/t, (this.pos.y - this.posPrev.y)/t);
				
			}
			
			getAcc()
			{
				return this.acc;
				
			}
			
			setPos(x, y)
			{
				this.pos = new Vector2(x, y);				
			}
			
			setVel(vx, vy)
			{
			
			}

			toString()
			{
				return 	("state2: " + this.name + " : ")  + '\n' +
				("current pos: " + this.pos.x.toFixed(1) + ", " + this.pos.y.toFixed(1))  + '\n' +
				("prev    pos: " + this.posPrev.x.toFixed(1) + ", " + this.posPrev.y.toFixed(1))  + '\n' +
				("vel        : " + this.getVel().x.toFixed(1) + ", " + this.getVel().y.toFixed(1))  + '\n' +
				("acc        : " + this.getAcc().x.toFixed(1) + ", " + this.getAcc().y.toFixed(1));
				
			}			
					
		}
		
		
		//TODO: separate point and state and 3 dimensions OK
		//fix box flattening OK
		// try the verlet update instead of normal OK
		// in normal, may have to update velocity as well as yprev. did not do that yet
		
		
		
		class Constraint
		{
			constructor(point1, point2, distance)
			{
				this.point1 = point1;
				this.point2 = point2;
				this.distance = distance;
				console.log("constraint instantiated: " + this.point1.name + " / " + this.point2.name);
			}
			
			enforceConstraint()
			{
				for (let i = 0; i < numberConstraintIterations; i++)
				{
					var margin = floorMargin; // meters
					// enforce c1
					if (this.point1.getPos().y > floorHeight+margin)
					{
						this.point1.setPos(this.point1.getPos().x, floorHeight);
						this.point1.setVel(this.point1.getVel().x, 0);						
						//this.point1.pos.y = floorHeight;
						//this.point1.vel.y = 0;
						//this.point1.acc.y = 0;
					}
					if (this.point2.getPos().y > floorHeight+margin)
					{
						this.point2.setPos(this.point2.getPos().x, floorHeight);
						this.point2.setVel(this.point2.getVel().x, 0);
						//this.point2.pos.y = floorHeight;
						//this.point2.vel.y = 0;
						//this.point2.acc.y = 0;
					}
				
					// enforce c2
					var distanceNew = Vector2.distance(this.point1.getPos(), this.point2.getPos());
					var distanceIncrease = distanceNew - this.distance;
					
					if (distanceIncrease < -0.1*this.distance)
					{
						console.log("side shrunk: " + this.point1.name + " " + this.point2.name);
					}
					
					var displacementDirX = this.point2.getPos().x - this.point1.getPos().x;
					var displacementDirY = this.point2.getPos().y - this.point1.getPos().y;
					var displacementNormalization = Vector2.distance(this.point1.getPos(), this.point2.getPos());
					
					displacementDirX = displacementDirX / displacementNormalization;
					displacementDirY = displacementDirY / displacementNormalization;
					
					var increment = 1/(numberConstraintIterations+1); //0.1;
					
					
					var point2posx = displacementDirX*(-distanceIncrease)*0.5*increment;
					var point2posy = displacementDirY*(-distanceIncrease)*0.5*increment;
					var point1posx = (-displacementDirX)*(-distanceIncrease)*0.5*increment;
					var point1posy = (-displacementDirY)*(-distanceIncrease)*0.5*increment;
					
					this.point2.setPos(this.point2.getPos().x + point2posx, this.point2.getPos().y + point2posy);
					this.point1.setPos(this.point1.getPos().x + point1posx, this.point1.getPos().y + point1posy);

				}			
			}
		
		}
		
		class Shape
		{
			
			constructor(name, points, constraints)
			{
				this.name = name;
				this.points = points;
				this.constraints = constraints
				console.log(this.name + " instantiated");
			}
			
			update()
			{
				this.points.forEach((point) => (point.update()));
				this.constraints.forEach((constraint) => (constraint.enforceConstraint()));
				console.log(this.name + " updated");			
			}			
			
		}
		
		
		
		class Ball extends Shape
		{
			constructor(radius, center)
			{
				super("Ball", [center], []);
				this.radius = radius;
			}
			
			draw()
			{
				context.fillStyle = colorFill;
				context.beginPath();
				context.arc(this.points[0].pos.x*pixelsPerMeter, this.points[0].pos.y*pixelsPerMeter, this.radius*pixelsPerMeter, 0, Math.PI*2);
				context.fill();
				context.closePath();	
				console.log("ball drawn");
			}
			
		}
		
		
		
		class Stick extends Shape
		{
			
			constructor(center, angle, length)
			{
			 	var p1 = StateFactory.getState(center.pos.x - 0.5*length*Math.cos(angle/180*Math.PI), center.pos.y - 0.5*length*Math.sin(angle/180*Math.PI), center.getVel().x, center.getVel().y, "stick left");
				var p3 = StateFactory.getState(center.pos.x + 0.5*length*Math.cos(angle/180*Math.PI), center.pos.y + 0.5*length*Math.sin(angle/180*Math.PI), center.getVel().x, center.getVel().y, "stick right");


				var points = [p1, p3];
				var stickLength = Vector2.distance(points[0].pos, points[1].pos);				
				var constraints = [new Constraint(points[0], points[1], stickLength)];
				
				super("Stick", points, constraints);

			}

			
			draw()
			{
				context.beginPath();

				context.moveTo(this.points[0].pos.x*pixelsPerMeter, this.points[0].pos.y*pixelsPerMeter);
				context.lineTo(this.points[1].pos.x*pixelsPerMeter, this.points[1].pos.y*pixelsPerMeter);
				context.strokeStyle = colorStroke;
				context.lineWidth = widthStroke;
				context.stroke();	
				context.closePath();	
				console.log("stick drawn");	

			this.points.forEach((point)=>(point.getPos().draw()));				
				
			}
			
		}
		
		class Box extends Shape
		{
			constructor(center, angle, length)
			{
				var points = [];
				var constraints = [];
				
				super("Box", points, constraints);

				var cos = Math.cos(angle/180*Math.PI);
				var sin = Math.sin(angle/180*Math.PI);
				
				var p1 = StateFactory.getState(center.getPos().x + length*cos*(-0.5) + length*sin*(-0.5), center.getPos().y + length*(-sin)*(-0.5) + length*cos*(-0.5), center.getVel().x, center.getVel().y, "box top left");
				var p2 = StateFactory.getState(center.getPos().x + length*cos*( 0.5) + length*sin*(-0.5), center.getPos().y + length*(-sin)*( 0.5) + length*cos*(-0.5), center.getVel().x, center.getVel().y, "box top right");
				var p3 = StateFactory.getState(center.getPos().x + length*cos*( 0.5) + length*sin*( 0.5), center.getPos().y + length*(-sin)*( 0.5) + length*cos*( 0.5), center.getVel().x, center.getVel().y, "box bottom right");
				var p4 = StateFactory.getState(center.getPos().x + length*cos*(-0.5) + length*sin*( 0.5), center.getPos().y + length*(-sin)*(-0.5) + length*cos*( 0.5), center.getVel().x, center.getVel().y, "box bottom left");
				
				this.points = [p1, p2, p3, p4];
				this.constraints = [
					new Constraint(this.points[0], this.points[1], length), 
					new Constraint(this.points[1], this.points[2], length),
					new Constraint(this.points[2], this.points[3], length),
					new Constraint(this.points[3], this.points[0], length),
					
					new Constraint(this.points[0], this.points[2], length*Math.sqrt(2)), 
					new Constraint(this.points[1], this.points[3], length*Math.sqrt(2)), 

				];
			}
			
			draw()
			{
				context.beginPath();

				context.moveTo(this.points[0].pos.x*pixelsPerMeter, this.points[0].pos.y*pixelsPerMeter);
				context.lineTo(this.points[1].pos.x*pixelsPerMeter, this.points[1].pos.y*pixelsPerMeter);
				context.lineTo(this.points[2].pos.x*pixelsPerMeter, this.points[2].pos.y*pixelsPerMeter);
				context.lineTo(this.points[3].pos.x*pixelsPerMeter, this.points[3].pos.y*pixelsPerMeter);
				context.lineTo(this.points[0].pos.x*pixelsPerMeter, this.points[0].pos.y*pixelsPerMeter);

				context.strokeStyle = colorStroke;
				context.fillStyle = colorFill;
				context.lineWidth = 3;
				context.fill();	
				context.stroke();
				context.closePath();	
				console.log("box drawn");	

				this.points.forEach((point)=>(point.getPos().draw()));				
				
				
			}	
		
		
		}



