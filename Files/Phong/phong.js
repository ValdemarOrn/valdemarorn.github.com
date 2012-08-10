/******************************************************************************
Copyright (c) 2012 Valdemar Örn Erlingsson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


 Name:		Phong
 Creator:	Valdemar Örn Erlingsson
 License:	MIT License

******************************************************************************/


Math.sign = function (val)
{
	return val / Math.abs(val);
}

// ------------------------------------ Contants and enums ------------------------------------

Phong = {};
Phong.States = {};
Phong.States.Starting = 0;
Phong.States.Paused = 1;
Phong.States.Playing = 2;
Phong.States.Timeout = 3;
Phong.States.GameOver = 4;

Phong.GameTypes = {};
Phong.GameTypes.Multiplayer = 0;
Phong.GameTypes.Easy = 1;
Phong.GameTypes.Medium = 2;
Phong.GameTypes.Hard = 3;

Phong.Selection = {};
Phong.Selection.Width = 0;
Phong.Selection.Height = 1;
Phong.Selection.GameType = 2;
Phong.Selection.BallSpeed = 3;
Phong.Selection.PaddleSpeed = 4;
Phong.Selection.Points = 5;

Phong.GameTypeName = function (gameType)
{
	if (gameType == Phong.GameTypes.Multiplayer)
		return "2 Players";
	if (gameType == Phong.GameTypes.Easy)
		return "Easy AI";
	if (gameType == Phong.GameTypes.Medium)
		return "Medium AI";
	if (gameType == Phong.GameTypes.Hard)
		return "Hard AI";

	return "";
}

// ------------------------------------ Game Objects ------------------------------------


Phong.Paddle = function (parent, color)
{
	this.Color = color;
	this.Parent = parent;
	this.PosX = 200;
	this.PosY = 20;

	this.Width = 40;
	this.Height = 5;

	this.Velocity = 0.0;

	this.Score = 0; // player score

	this.Process = function ()
	{
		this.PosX = this.PosX + this.Velocity;
		if (this.PosX < 0)
			this.PosX = 0;

		if (this.PosX > (this.Parent.Width - this.Width))
			this.PosX = this.Parent.Width - this.Width;
	}

	this.Draw = function (ctx)
	{
		ctx.fillStyle = this.Color;
		ctx.fillRect(this.PosX, this.PosY, this.Width, this.Height);
	}

}

Phong.Ball = function (parent)
{
	this.Parent = parent;

	this.PosX = 200;
	this.PosY = 200;

	this.Diameter = 8.0;
	this.Velocity = 0.0;

	this.DirX = 0.0;
	this.DirY = 1.0;

	// Deflection tells where on the paddle the ball hits. It is approx in the range on -1.0...1.0
	// -1.0 being the far left side, 1.0 the far right
	this.Process = function (distance, deflection)
	{
		// Pythagoras. nomalize unit vector
		var len = Math.sqrt(this.DirX * this.DirX + this.DirY * this.DirY);
		this.DirX = this.DirX / len;
		this.DirY = this.DirY / len;

		var dy = this.Velocity * this.DirY;
		var dx = this.Velocity * this.DirX;

		// if hitting the paddle
		if (distance !== null && Math.abs(dy) >= Math.abs(distance) && Math.sign(dy) === Math.sign(distance))
		{
			//this.DirY = -this.DirY;
			if (dy < 0)
			{
				var ddy = distance - dy;
				this.PosY = this.PosY + distance + ddy;

				this.DirY = -this.DirY;
			}
			else // dy > 0
			{
				var ddy = dy - distance;
				this.PosY = this.PosY + distance - ddy;

				this.DirY = -this.DirY;
			}

			// recalculate the DirX based on deflection

			// limit the x-movement of the ball
			this.DirX = this.DirX + deflection;
			if (this.DirX > 1.2)
				this.DirX = 1.2;
			if (this.DirX < -1.2)
				this.DirX = -1.2;

			var len = Math.sqrt(this.DirX * this.DirX + this.DirY * this.DirY);
			this.DirX = this.DirX / len;
			this.DirY = this.DirY / len;
		}
		else
		{
			this.PosY = this.PosY + dy;
		}

		// Move in x direction
		this.PosX = this.PosX + dx;

		// Hit left bank
		if (this.DirX < 0.0 && this.PosX <= 0)
		{
			this.PosX = -this.PosX;
			this.DirX = -this.DirX;
		}

		// Hit right bank
		if (this.DirX > 0.0 && this.PosX >= (this.Parent.Width - this.Diameter))
		{
			var pixelsOutside = (this.PosX + this.Diameter) - this.Parent.Width;
			this.PosX = this.Parent.Width - this.Diameter - pixelsOutside;
			this.DirX = -this.DirX;
		}
	};

	this.Draw = function (ctx)
	{
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.beginPath();
		ctx.arc(this.PosX + this.Diameter / 2, this.PosY + this.Diameter / 2, this.Diameter / 2, 0, 2 * Math.PI, false);
		ctx.fill();
	};

}

Phong.KeyboardController = function ()
{

	this.LeftKey = false;
	this.RightKey = false;
	this.UpKey = false;
	this.DownKey = false;
	this.Z = false;
	this.X = false;
	this.Enter = false;
	this.P = false;

	this.Bind = function ()
	{

		var ctrl = this;

		window.onkeydown = function (event)
		{
			if (event.keyCode == 37)
			{
				ctrl.LeftKey = true;
			}
			else if (event.keyCode == 39)
			{
				ctrl.RightKey = true;
			}
			else if (event.keyCode == 38)
			{
				ctrl.UpKey = true;
			}
			else if (event.keyCode == 40)
			{
				ctrl.DownKey = true;
			}
			else if (event.keyCode == 90)
			{
				ctrl.Z = true;
			}
			else if (event.keyCode == 88)
			{
				ctrl.X = true;
			}
			else if (event.keyCode == 13)
			{
				ctrl.Enter = true;
			}
			else if (event.keyCode == 80)
			{
				ctrl.P = true;
			}
		};

		window.onkeyup = function (event)
		{

			if (event.keyCode == 37)
			{
				ctrl.LeftKey = false;
			}
			else if (event.keyCode == 39)
			{
				ctrl.RightKey = false;
			}
			else if (event.keyCode == 38)
			{
				ctrl.UpKey = false;
			}
			else if (event.keyCode == 40)
			{
				ctrl.DownKey = false;
			}
			else if (event.keyCode == 90)
			{
				ctrl.Z = false;
			}
			else if (event.keyCode == 88)
			{
				ctrl.X = false;
			}
			else if (event.keyCode == 13)
			{
				ctrl.Enter = false;
			}
			else if (event.keyCode == 80)
			{
				ctrl.P = false;
			}
		};

	}
}

Phong.AI = function (parent)
{
	this.Parent = parent;

	this.Move = function ()
	{
		var width = this.Parent.PaddleB.Width;
		var ballX = this.Parent.Ball.PosX;
		var paddleX = this.Parent.PaddleB.PosX + width / 2;

		var speed = this.Parent.PaddleSpeed;
		if (this.Parent.GameType == Phong.GameTypes.Easy)
			speed = speed * 0.65;
		if (this.Parent.GameType == Phong.GameTypes.Medium)
			speed = speed * 0.8;

		if (this.Parent.Ball.DirY < 0)
		{
			if (ballX < paddleX - 0.2 * width)
			{
				this.Parent.PaddleB.Velocity = -speed;
				this.Parent.PaddleB.Process();
			}
			else if (ballX > paddleX + 0.2 * width)
			{
				this.Parent.PaddleB.Velocity = speed;
				this.Parent.PaddleB.Process();
			}
		}

		var scale = this.Parent.Width / this.Parent.Height;
		
		// If the arena is wide and we are in medium mode, the paddle returns to the center
		var mediumReturn = this.Parent.Ball.DirY > 0 && this.Parent.GameType == Phong.GameTypes.Medium && scale > 1.5
		
		// if the arena is not wide and we are in hard mode, the paddle returns to the center
		var hardReturn = this.Parent.Ball.DirY > 0 && this.Parent.GameType == Phong.GameTypes.Hard && scale <= 1.5
		
		if (mediumReturn || hardReturn)
		{
			var dx = this.Parent.Width / 2 - paddleX;
			if (dx > width / 2)
			{
				this.Parent.PaddleB.Velocity = speed;
				this.Parent.PaddleB.Process();
			}
			if (dx < -(width / 2))
			{
				this.Parent.PaddleB.Velocity = -speed;
				this.Parent.PaddleB.Process();
			}
		}
		
		// if the arena is wide then hard mode constantly tracks the ball
		if(this.Parent.Ball.DirY > 0 && this.Parent.GameType == Phong.GameTypes.Hard && scale > 1.5)
		{
			if (ballX < paddleX - 0.2 * width)
			{
				this.Parent.PaddleB.Velocity = -speed;
				this.Parent.PaddleB.Process();
			}
			else if (ballX > paddleX + 0.2 * width)
			{
				this.Parent.PaddleB.Velocity = speed;
				this.Parent.PaddleB.Process();
			}
		}
		
		

	}
}

// ------------------------------------ Main Class ------------------------------------

Phong.Game = function (canvas, fps)
{
	this.ContextLoaded = false;
	var context = null;
	
	try
	{
		context = canvas.getContext("2d");
	}
	catch(err)
	{
		alert("Canvas Element is not supported in this browser");
		return;
	}
	
	this.ContextLoaded = true;

	this.ColorA = 'rgba(12, 95, 168, 1.0)'; // blue
	this.ColorB = 'rgba(189, 19, 78, 1.0)'; // red

	this.Canvas = canvas;
	this.Context = context;
	this.Width = canvas.width;
	this.Height = canvas.height;
	this.FPS = fps;
	this.GameState = Phong.States.Starting;

	this.TimeoutFrames = 0; // used to pause the game
	this.PlayerWhoScored = null;

	this.Points = 21;
	this.GameType = Phong.GameTypes.Multiplayer;
	this.BallSpeed = 4.5;
	this.PaddleSpeed = 4.5;

	this.Controller = new Phong.KeyboardController();
	this.Controller.Bind();

	this.AI = null;

	this.PaddleA = new Phong.Paddle(this, this.ColorA);
	this.PaddleB = new Phong.Paddle(this, this.ColorB);
	this.Ball = new Phong.Ball(this);

	this.Init = function ()
	{
		this.PaddleA.Score = 0;
		this.PaddleB.Score = 0;
		this.Ball.Velocity = this.BallSpeed;
		this.AI = new Phong.AI(this);

		this.StartRound();
		this.GameState = Phong.States.Timeout;
		this.TimeoutFrames = 60;
	};

	this.StartRound = function ()
	{
		this.PaddleA.PosX = this.Width / 2 - this.PaddleA.Width / 2;
		this.PaddleA.PosY = this.Height - 20;

		this.PaddleB.PosX = this.Width / 2 - this.PaddleB.Width / 2;
		this.PaddleB.PosY = 20;

		this.Ball.PosX = this.Width / 2 - this.Ball.Diameter / 2;
		this.Ball.PosY = this.Height / 2 - this.Ball.Diameter / 2;

		if (this.PlayerWhoScored === null)
			this.PlayerWhoScored = this.PaddleB;

		this.Ball.DirX = 0.05;

		// which way to send the ball? Send it to the player who lost
		if (this.PlayerWhoScored === this.PaddleB)
			this.Ball.DirY = 1.0;
		else
			this.Ball.DirY = -1.0;
	}

	// Starts the game loop
	this.Start = function ()
	{
		var that = this;
		setInterval(function () { that.Process(); }, 1000 / this.FPS);
	};

	// checks if the ball hits a paddle
	this.RemainingDistance = function ()
	{

		// Upper paddle, paddle B
		if (this.Ball.PosY < this.Height / 2)
		{
			var curr = this.Ball.PosY;
			var paddle = this.PaddleB.PosY + this.PaddleB.Height;
			var distance = paddle - curr;

			// check if paddle is covering the ball. Ball is extended by 2 px to make it easier to hit (more fun :)
			var ballLX = this.Ball.PosX + this.Ball.DirX * distance - 2;
			var ballRX = this.Ball.PosX + this.Ball.DirX * distance + this.Ball.Diameter + 2;
			if (!(this.PaddleB.PosX <= ballRX && (this.PaddleB.PosX + this.PaddleB.Width) >= ballLX))
				return null;

			return distance;

		}
		// Lower paddle, paddle A
		else
		{
			var curr = this.Ball.PosY + this.Ball.Diameter;
			var paddle = this.PaddleA.PosY;
			var distance = paddle - curr;

			// check if paddle is covering the ball. Ball is extended by 2 px to make it easier to hit (more fun :)
			var ballLX = this.Ball.PosX + this.Ball.DirX * distance - 2;
			var ballRX = this.Ball.PosX + this.Ball.DirX * distance + this.Ball.Diameter + 2;
			if (!(this.PaddleA.PosX <= ballRX && (this.PaddleA.PosX + this.PaddleA.Width) >= ballLX))
				return null;

			return distance;
		}

	};

	// calculate the effect of the paddle on the ball. Hitting the ball at the
	// ends will change the reflection angle
	this.Deflection = function ()
	{
		var ballCenter = this.Ball.PosX + this.Ball.Diameter / 2;

		// upper paddle, Paddle B
		if (this.Ball.PosY < this.Height / 2)
		{
			var paddleCenter = this.PaddleB.PosX + this.PaddleB.Width * 0.5;
			var deflection = (ballCenter - paddleCenter) / (this.PaddleB.Width * 0.5);
		}
		// Lower Paddle, Paddle A
		else
		{
			var paddleCenter = this.PaddleA.PosX + this.PaddleA.Width * 0.5;
			var deflection = (ballCenter - paddleCenter) / (this.PaddleA.Width * 0.5);
		}

		return 1.3 * deflection;
	}

	// Check if the ball is touching either end of the board.
	// If it is, increment the players score and return true
	// otherwise, return false
	this.CheckGoal = function ()
	{
		if (this.Ball.PosY <= 0)
		{
			this.PaddleA.Score++;
			this.PlayerWhoScored = this.PaddleA;
			return true;
		}
		if ((this.Ball.PosY + this.Ball.Diameter) >= this.Height)
		{
			this.PaddleB.Score++;
			this.PlayerWhoScored = this.PaddleB;
			return true;
		}

		return false;
	}

	// Main processing loop. Reads keyboard, draws the game, checks state
	this.Process = function ()
	{
		var ctx = this.Context;

		if (this.GameState == Phong.States.Starting)
		{
			this.ShowStartup();
			return;
		}

		if (this.GameState == Phong.States.GameOver)
		{
			this.ShowGameOver();
			return;
		}

		// draw playing field
		ctx.clearRect(0, 0, this.Width, this.Height);
		context.strokeStyle = '#000'; // red
		context.lineWidth = 1;
		ctx.strokeRect(0, 0, this.Width, this.Height);

		// draw score
		ctx.font = "14pt Calibri";
		ctx.globalAlpha = 0.4;

		var text = "-";
		var len = (ctx.measureText(text)).width;
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.fillText(text, this.Width / 2 - len/2, this.Height / 2);

		var text = "" + this.PaddleA.Score;
		var len = (ctx.measureText(text)).width;
		ctx.fillStyle = this.ColorA;
		ctx.fillText(text, this.Width / 2 - len - 10, this.Height / 2);

		var text = "" + this.PaddleB.Score;
		var len = (ctx.measureText(text)).width;
		ctx.fillStyle = this.ColorB;
		ctx.fillText(text, this.Width / 2 + 10, this.Height / 2);

		ctx.globalAlpha = 1.0;

		if (this.Controller.P)
		{
			this.Controller.P = false;
			if (this.GameState == Phong.States.Paused)
				this.GameState = Phong.States.Playing;
			else
				this.GameState = Phong.States.Paused;
		}

		if (this.GameState == Phong.States.Playing)
		{


			// Move paddles
			if (this.Controller.LeftKey)
			{
				this.PaddleA.Velocity = -this.PaddleSpeed;
				this.PaddleA.Process();
			}
			if (this.Controller.RightKey)
			{
				this.PaddleA.Velocity = this.PaddleSpeed;
				this.PaddleA.Process();
			}

			// There is a second player, read input from keyboard
			if (this.GameType == Phong.GameTypes.Multiplayer)
			{
				if (this.Controller.Z)
				{
					this.PaddleB.Velocity = -this.PaddleSpeed;
					this.PaddleB.Process();
				}
				if (this.Controller.X)
				{
					this.PaddleB.Velocity = this.PaddleSpeed;
					this.PaddleB.Process();
				}
			}
			// Single player game, AI moves the paddle
			else
			{
				this.AI.Move();
			}

			var distance = this.RemainingDistance();
			var deflection = 0.0;

			if (distance !== null && Math.abs(distance) < 10)
				deflection = this.Deflection();

			this.Ball.Process(distance, deflection);

			var goal = this.CheckGoal();
			if (goal)
			{
				if (this.PaddleA.Score >= this.Points || this.PaddleB.Score >= this.Points)
					this.GameState = Phong.States.GameOver;
				else
				{
					this.GameState = Phong.States.Timeout;
					this.TimeoutFrames = this.FPS; // 1 second delay
				}
			}
		}

		if (this.GameState === Phong.States.Timeout)
		{
			this.TimeoutFrames--;
			if (this.TimeoutFrames <= 0)
			{
				this.StartRound();
				this.GameState = Phong.States.Playing;
			}
		}

		this.PaddleA.Draw(ctx);
		this.PaddleB.Draw(ctx);
		this.Ball.Draw(ctx);


	};

	this.StartupSelection = 0;

	// Draws the startup screen and reads key input
	this.ShowStartup = function ()
	{
		var ctx = this.Context;

		// draw playing field and text
		ctx.clearRect(0, 0, this.Width, this.Height);
		context.strokeStyle = '#000'; // red
		context.lineWidth = 1;
		ctx.strokeRect(0, 0, this.Width, this.Height);

		ctx.font = "16px Verdana";

		if (this.GameType == Phong.GameTypes.Multiplayer)
		{
			// write player B
			var text = "Player B";
			var len = (ctx.measureText(text)).width;
			ctx.fillText(text, this.Width / 2 - len / 2, 35);
			var text = "Z - X";
			var len = (ctx.measureText(text)).width;
			ctx.fillText(text, this.Width / 2 - len / 2, 65);
		}

		// write player A
		var text = "Player A";
		var len = (ctx.measureText(text)).width;
		ctx.fillText(text, this.Width / 2 - len / 2, this.Height - 60);
		var text = "Left - Right";
		var len = (ctx.measureText(text)).width;
		ctx.fillText(text, this.Width / 2 - len / 2, this.Height - 30);

		// write enter to start
		var text = "Press ENTER to start";
		var len = (ctx.measureText(text)).width;
		ctx.fillText(text, this.Width / 2 - len / 2, this.Height / 2 + 90);

		// Write menu
		ctx.font = "12px Verdana";
		var l = this.Width / 2 - 90;
		var h = this.Height / 2 - 100;

		var text = "Arena Width";
		ctx.fillText(text, l, h);
		var text = "Arena Height";
		ctx.fillText(text, l, h + 30);
		var text = "Game Type";
		ctx.fillText(text, l, h + 60);
		var text = "Ball Speed";
		ctx.fillText(text, l, h + 90);
		var text = "Paddle Speed";
		ctx.fillText(text, l, h + 120);
		var text = "Points";
		ctx.fillText(text, l, h + 150);

		// write values
		l = l + 160;

		var text = this.Width;
		var len = (ctx.measureText(text)).width;
		ctx.fillText(text, l - len / 2, h);

		var text = this.Height;
		var len = (ctx.measureText(text)).width;
		ctx.fillText(text, l - len / 2, h + 30);

		var text = Phong.GameTypeName(this.GameType);
		var len = (ctx.measureText(text)).width;
		ctx.fillText(text, l - len / 2, h + 60);

		var text = this.BallSpeed.toFixed(2).toString(10);
		var len = (ctx.measureText(text)).width;
		ctx.fillText(text, l - len / 2, h + 90);

		var text = this.PaddleSpeed.toFixed(2).toString(10);
		var len = (ctx.measureText(text)).width;
		ctx.fillText(text, l - len / 2, h + 120);

		var text = this.Points.toString(10);
		var len = (ctx.measureText(text)).width;
		ctx.fillText(text, l - len / 2, h + 150);


		ctx.fillStyle = '#000';
		ctx.beginPath();
		if (this.StartupSelection == 0)
			h = h - 4;
		if (this.StartupSelection == 1)
			h = h + 30 - 4;
		if (this.StartupSelection == 2)
			h = h + 60 - 4;
		if (this.StartupSelection == 3)
			h = h + 90 - 4;
		if (this.StartupSelection == 4)
			h = h + 120 - 4;
		if (this.StartupSelection == 5)
			h = h + 150 - 4;

		// Show left arrow
		ctx.moveTo(l - 50, h);
		ctx.lineTo(l - 40, h - 5);
		ctx.lineTo(l - 40, h + 5);
		ctx.lineTo(l - 50, h);
		ctx.fill();

		// Show right arrow
		ctx.moveTo(l + 50, h);
		ctx.lineTo(l + 40, h - 5);
		ctx.lineTo(l + 40, h + 5);
		ctx.lineTo(l + 50, h);
		ctx.fill();

		this.ReadStartupKeys();
	}

	// Read keyboard input during the startup screen
	this.ReadStartupKeys = function ()
	{
		// Change canvas width
		if (this.StartupSelection == Phong.Selection.Width)
		{
			if (this.Controller.LeftKey)
			{
				this.Width = this.Width - 10;
				this.Controller.LeftKey = false;
				if (this.Width < 280)
					this.Width = 280;
				this.Canvas.width = this.Width;
			}
			if (this.Controller.RightKey)
			{
				this.Width = this.Width + 10;
				this.Canvas.width = this.Width;
				this.Controller.RightKey = false;
			}
		}

		// Change canvas height
		if (this.StartupSelection == Phong.Selection.Height)
		{
			if (this.Controller.LeftKey)
			{
				this.Height = this.Height - 10;
				this.Controller.LeftKey = false;
				if (this.Height < 400)
					this.Height = 400;
				this.Canvas.height = this.Height;
			}
			if (this.Controller.RightKey)
			{
				this.Height = this.Height + 10;
				this.Canvas.height = this.Height;
				this.Controller.RightKey = false;
			}
		}

		// Change game type
		if (this.StartupSelection == Phong.Selection.GameType)
		{
			if (this.Controller.LeftKey)
			{
				this.GameType--;
				this.Controller.LeftKey = false;
				if (this.GameType < 0)
					this.GameType = 0;
			}
			if (this.Controller.RightKey)
			{
				this.GameType++;
				this.Controller.RightKey = false;
				if (this.GameType > Phong.GameTypes.Hard)
					this.GameType = Phong.GameTypes.Hard;
			}
		}

		// Change Ball speed
		if (this.StartupSelection == Phong.Selection.BallSpeed)
		{
			if (this.Controller.LeftKey)
			{
				this.BallSpeed = this.BallSpeed - 0.1;
				this.Controller.LeftKey = false;
				if (this.BallSpeed < 0.5)
					this.BallSpeed = 0.5;
			}
			if (this.Controller.RightKey)
			{
				this.BallSpeed = this.BallSpeed + 0.1;
				this.Controller.RightKey = false;
			}
		}

		// Change paddle speed
		if (this.StartupSelection == Phong.Selection.PaddleSpeed)
		{
			if (this.Controller.LeftKey)
			{
				this.PaddleSpeed = this.PaddleSpeed - 0.1;
				this.Controller.LeftKey = false;
				if (this.PaddleSpeed < 0.5)
					this.PaddleSpeed = 0.5;
			}
			if (this.Controller.RightKey)
			{
				this.PaddleSpeed = this.PaddleSpeed + 0.1;
				this.Controller.RightKey = false;
			}
		}

		// Change number of points
		if (this.StartupSelection == Phong.Selection.Points)
		{
			if (this.Controller.LeftKey)
			{
				this.Points--;
				this.Controller.LeftKey = false;
				if (this.Points < 1)
					this.Points = 1;
			}
			if (this.Controller.RightKey)
			{
				this.Points++;
				this.Controller.RightKey = false;
			}
		}

		// travel up and down menu
		if (this.Controller.UpKey && this.StartupSelection > 0)
		{
			this.StartupSelection--;
			this.Controller.UpKey = false;
		}
		if (this.Controller.DownKey && this.StartupSelection < Phong.Selection.Points)
		{
			this.StartupSelection++;
			this.Controller.DownKey = false;
		}


		if (this.Controller.Enter)
			this.Init();
	}

	this.ShowGameOver = function ()
	{
		var ctx = this.Context;

		// draw playing field and text
		ctx.clearRect(0, 0, this.Width, this.Height);
		context.strokeStyle = '#000'; // red
		context.lineWidth = 1;
		ctx.strokeRect(0, 0, this.Width, this.Height);



		// write Game over
		ctx.font = "32px Verdana";
		var text = "GAME OVER";
		var len = (ctx.measureText(text)).width;
		ctx.fillText(text, this.Width / 2 - len / 2, this.Height / 2 - 80);

		// find winning player
		ctx.font = "24px Verdana";
		var text = (this.PaddleA.Score > this.PaddleB.Score) ? "Player A Wins" : "Player B Wins";
		var len = (ctx.measureText(text)).width;
		ctx.fillText(text, this.Width / 2 - len / 2, this.Height / 2 - 20);

		ctx.font = "12px Verdana";
		var text = "Press ENTER to play again";
		var len = (ctx.measureText(text)).width;
		ctx.fillText(text, this.Width / 2 - len / 2, this.Height / 2 + 30);

		if (this.Controller.Enter)
		{
			this.GameState = Phong.States.Starting;
			this.Controller.Enter = false;
		}
	}
}