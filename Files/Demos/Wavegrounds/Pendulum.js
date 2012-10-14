/// <reference path="jquery-1.7.1.intellisense.js"/>
/// <reference path="jquery-1.7.1.js" />

// Objects

M = {};

M.ConfigInfo =
{
	CanvasWidth:        { def: 1000,     min: 100,           max: 10000,        type: 'limit',      scale: 10,     precision: 0 },
	CanvasHeight:       { def: 1000,     min: 100,           max: 10000,        type: 'limit',      scale: 10,     precision: 0 },
	CanvasScale:        { def: 100,      min: 1,             max: 300,          type: 'limit',      scale: 1,      precision: 0 },
	
	Precision:          { def: 2000,     min: 100,           max: 5000,         type: 'limit',      scale: 50,     precision: 0 },

	StartTime:          { def: 0,        min: 0,             max: 1000,         type: 'explimit',   scale: 0.01,   precision: 2 },
	SimulationTime:     { def: 100,      min: 0,             max: 1000,         type: 'explimit',   scale: 0.01,   precision: 2 },
	
	XSize:              { def: 0.8,      min: 0.1,           max: 10,           type: 'explimit',   scale: 0.02,   precision: 2 },
	YSize:              { def: 0.5,      min: 0.1,           max: 10,           type: 'explimit',   scale: 0.02,   precision: 2 },
	XSwingPhase:        { def: 0.0,      min: -Math.PI,      max: Math.PI,      type: 'limit',      scale: 0.02,   precision: 2 },
	YSwingPhase:        { def: 0.0,      min: -Math.PI,      max: Math.PI,      type: 'limit',      scale: 0.02,   precision: 2 },
	
	XSwingSpeed:        { def: 1,        min: 0,             max: 100,          type: 'explimit',   scale: 0.01,   precision: 5 },
	YSwingSpeed:        { def: 1,        min: 0,             max: 100,          type: 'explimit',   scale: 0.01,   precision: 5 },
	
	XModulation:        { def: 0.0,      min: 0,             max: 1,            type: 'limit',      scale: 0.002,  precision: 3 },
	YModulation:        { def: 0.0,      min: 0,             max: 1,            type: 'limit',      scale: 0.002,  precision: 3 },
	XModulationSpeed:   { def: 0.00001,  min: 0,             max: 100,          type: 'explimit',   scale: 0.01,   precision: 4 },
	YModulationSpeed:   { def: 0.00001,  min: 0,             max: 100,          type: 'explimit',   scale: 0.01,   precision: 4 },
	XModulationPhase:   { def: 0,        min: -Math.PI,      max: Math.PI,      type: 'limit',      scale: 0.02,   precision: 4 },
	YModulationPhase:   { def: 0,        min: -Math.PI,      max: Math.PI,      type: 'limit',      scale: 0.02,   precision: 4 },
	
	XDecayRate:         { def: 0.00001,  min: 0,             max: 1,            type: 'explimit',   scale: 0.01,   precision: 4 },
	YDecayRate:         { def: 0.00001,  min: 0,             max: 1,            type: 'explimit',   scale: 0.01,   precision: 4 },
	
	RotationSpeed:      { def: 0.01,     min: 0,             max: 10,           type: 'explimit',   scale: 0.01,   precision: 4 },
	RotationPhase:      { def: 0,        min: -Math.PI,      max: Math.PI,      type: 'limit',      scale: 0.02,   precision: 4 },
	
	RotationMod:        { def: 0.0,      min: 0,             max: 1,            type: 'limit',      scale: 0.002,  precision: 3 },
	RotationModSpeed:   { def: 0.00001,  min: 0,             max: 100,          type: 'explimit',   scale: 0.01,   precision: 4 },
	RotationModPhase:   { def: 0,        min: -Math.PI,      max: Math.PI,      type: 'limit',      scale: 0.02,   precision: 4 },
	
	PlaneAngleX:        { def: 0.0,      min: -Math.PI / 2,  max: Math.PI / 2,  type: 'limit',      scale: 0.02,   precision: 4 },
	PlaneAngleY:        { def: 0.0,      min: -Math.PI / 2,  max: Math.PI / 2,  type: 'limit',      scale: 0.02,   precision: 4 },
	PlaneHeight:        { def: 300,      min: 10,            max: 10000,        type: 'limit',      scale: 10,     precision: 0 },

	PanX:               { def: 0.0,      min: -1.0,          max: 1.0,          type: 'limit',      scale: 0.005,  precision: 3 },
	PanY:               { def: 0.0,      min: -1.0,          max: 1.0,          type: 'limit',      scale: 0.005,  precision: 3 },
	Zoom:               { def: 1.0,      min: 0.01,          max: 10000.0,      type: 'explimit',   scale: 0.01,   precision: 4 },
	Rotate:             { def: 0.0,      min: -Math.PI,      max: Math.PI,      type: 'limit',      scale: 0.01,   precision: 3 },
};

M.Main = function (canvas)
{
	this.Canvas = canvas;
	this.Context = canvas.getContext("2d");
	this.Width = 1000;
	this.Height = 1000;
	this.CanvasScale = 100;

	this.Radius = 0.4;
	this.n = 0;

	// --------------------------------------------------------------------------

	this.Config =
	{
		CanvasWidth: 1000,
		CanvasHeight: 1800,
		CanvasScale: 100,

		// Samplerate, or how many discrete points correspond to t = 1.0
		Precision: 1000,

		// Where to start drawing
		StartTime: 0,

		// how many samples to draw
		SimulationTime: 100,


		// x/y-axis length, relative to canvas size
		XSize: 0.8,
		YSize: 0.8,

		// inital phase of the swing, in radians
		XSwingPhase: 0,
		YSwingPhase: 0,


		// swings per sec.
		XSwingSpeed: 1.0,
		YSwingSpeed: 1.0,

		
		// x/y-axis length modulation strength, percentage
		XModulation: 0.0,
		YModulation: 0.0,

		// ellipse x/y-axis modulation speed, in revolutions /sec ( 2*PI*rad/sec )
		XModulationSpeed: 0.001,
		YModulationSpeed: 0.001,

		// ellipse x/y-axis modulation initial phase, in radians
		XModulationPhase: 0,
		YModulationPhase: 0,


		// Decay rate, percentage of energy lost each second
		XDecayRate: 0.002,
		YDecayRate: 0.002,


		// Speed of path rotation, in rad/sec
		RotationSpeed: 0,
		RotationPhase: 0,

		// rotation modulation
		RotationMod: 0.0,
		RotationModSpeed: 0.001,
		RotationModPhase: 0.0,


		// The angle of the drawing plane
		PlaneAngleX: 0.0,
		PlaneAngleY: 0.0,
		PlaneHeight: 300,

		// Move the origin point around on the canvas
		PanX: 0,
		PanY: 0,

		// multiplies the distance between origin and point
		Zoom: 1.0,

		// Roatates every point around the origin, radians
		Rotate: 0.0

	};

	this.Settings =
	{
		SwingSpeedEnabled: false,
		SwingModulationEnabled: false,
		DecayRateEnabled: true,
		RotationEnabled: true,
		RotationModEnabled: false,
		PlaneAngleEnabled: false
	}

	// --------------------------------------------------------------------------

	this.Init = function ()
	{
		this.Canvas.width = this.Width;
		this.Canvas.height = this.Height;
	}

	this.Process = function ()
	{
		var cfg = this.Config;

		if (cfg.CanvasWidth !== this.Width)
			this.ResizeCanvas();
		if (cfg.CanvasHeight !== this.Height)
			this.ResizeCanvas();
		if (cfg.CanvasScale !== this.CanvasScale)
			this.ScaleCanvas();

		this.Context.fillStyle = "rgba(0, 0, 0, 1)";
		this.Context.strokeStyle = "black";
		this.Context.lineWidth = 0.4;

		var i = this.n;
		this.n = this.n + 1000;

		if (this.n > this.Config.Precision * this.Config.SimulationTime)
			this.n = this.Config.Precision * this.Config.SimulationTime;

		// line thickness and color:
		// vary by speed (distance between last and current point)
		// Surface tilt, x,y, with modulation
		// rotation modulation

		// pan x,y, zoom, rotate
		// canvas width, height

		while (i < this.n)
		{
			var t = i / cfg.Precision;
			var cycleX = t * 2 * Math.PI * cfg.XSwingSpeed + cfg.XSwingPhase;
			var cycleY = t * 2 * Math.PI * cfg.YSwingSpeed + cfg.YSwingPhase;

			// swing
			var x = (cfg.XSize * this.Width / 2) * Math.cos(cycleX);
			var y = (cfg.YSize * this.Height / 2) * Math.sin(cycleY);

			// Swing modulation
			var cycleXMod = t * 2 * Math.PI * cfg.XModulationSpeed + cfg.XModulationPhase;
			var cycleYMod = t * 2 * Math.PI * cfg.YModulationSpeed + cfg.YModulationPhase;
			var modX = (1 - cfg.XModulation) + cfg.XModulation * Math.cos(cycleXMod);
			var modY = (1 - cfg.YModulation) + cfg.YModulation * Math.cos(cycleYMod);
			x = x * modX;
			y = y * modY;

			// decay
			var decayX = Math.pow(1 - cfg.XDecayRate, t);
			var decayY = Math.pow(1 - cfg.YDecayRate, t);
			x = x * decayX;
			y = y * decayY;

			// rotation, continuous
			var rotModAngle = t * 2 * Math.PI * cfg.RotationModSpeed + cfg.RotationModPhase;
			var rotMod = cfg.RotationMod * Math.cos(rotModAngle);

			var rotateAngle = t * 2 * Math.PI * cfg.RotationSpeed + cfg.RotationPhase + rotMod;
			
			var rotateAngle = rotateAngle + rotMod;

			var rotated = rotatePoint(x, y, rotateAngle);
			x = rotated[0];
			y = rotated[1];

			// plane transformation
			var transformed = this.PlaneTransform(x, y);
			x = transformed[0];
			y = transformed[1];


			// zoom, pan, rotate
			x = x * cfg.Zoom;
			y = y * cfg.Zoom;

			var rotated = rotatePoint(x, y, cfg.Rotate);
			x = rotated[0];
			y = rotated[1];

			x = x + (cfg.PanX * this.Width * 2);
			y = y + (cfg.PanY * this.Height * 2);

			// Draw

			x = this.Width / 2 + x;
			y = this.Height / 2 + y;

			this.Draw(x, y);

			i++;
		}
	}

	this.Reset = function ()
	{
		this.Points = [null, null, null, null, null];
		var c = this.Context;
		c.beginPath();
		c.fillStyle = "white";
		c.rect(0, 0, this.Width, this.Height);
		c.fill();
		this.n = this.Config.StartTime * this.Config.Precision;
	}

	this.ResizeCanvas = function ()
	{
		var w = this.Config.CanvasWidth;
		var h = this.Config.CanvasHeight;

		this.Width = w;
		this.Height = h;
		this.Canvas.width = w;
		this.Canvas.height = h;
		this.Reset();
		this.ScaleCanvas();
	}

	this.ScaleCanvas = function ()
	{
		this.CanvasScale = this.Config.CanvasScale;
		var width = this.CanvasScale / 100 * this.Width;
		var height = this.CanvasScale / 100 * this.Height;

		var marginLeft = Math.roundTo(width/2, 0);
		var marginTop = Math.roundTo(height/2, 0) - 10;

		$('#Canvas').css('width', width.toString() + 'px');
		$('#Canvas').css('height', height.toString() + 'px');
		$('#Canvas').css('margin-left', -marginLeft.toString() + 'px');
		$('#Canvas').css('margin-top', -marginTop.toString() + 'px');
	}

	this.PlaneTransform = function(x, y)
	{
		var output = [null, null];

		// x
		var b = this.Config.PlaneAngleX;
		var C = x;
		var L = this.Config.PlaneHeight;

		var a = Math.atan(C / L);
		var c = Math.PI / 2 - b - a;
		var A = C / Math.sin(c) * Math.sin(a + Math.PI / 2);
		output[0] = A;

		// y
		b = this.Config.PlaneAngleY;
		C = y;
		L = this.Config.PlaneHeight;

		var a = Math.atan(C / L);
		var c = Math.PI / 2 - b - a;
		var A = C / Math.sin(c) * Math.sin(a + Math.PI / 2);
		output[1] = A;

		return output;
	}

	// FILO queue of points to draw
	this.Points = [null, null, null, null, null];

	this.Draw = function (x, y)
	{
		// Push new point to the end of the point queue
		this.Points[0] = this.Points[1];
		this.Points[1] = this.Points[2];
		this.Points[2] = this.Points[3];
		this.Points[3] = this.Points[4];
		this.Points[4] = { X: x, Y: y };

		if (this.Points[0] == null)
			return;

		this.DrawBezier();
	}

	this.DrawDot = function ()
	{
		this.Context.beginPath();
		this.Context.arc(this.Points[0].X, this.Points[0].Y, this.Radius, 0, 2 * Math.PI, false);
		this.Context.fill();
	}

	this.DrawBezier = function ()
	{
		var p0 = this.Points[0];
		var p1 = this.Points[1];
		var p2 = this.Points[2];
		var p3 = this.Points[3];

		var x0 = (p0.X + p1.X) / 2;
		var y0 = (p0.Y + p1.Y) / 2;

		var x1 = (p2.X + p3.X) / 2;
		var y1 = (p2.Y + p3.Y) / 2;

		this.Context.beginPath();
		this.Context.moveTo(x0, y0);
		this.Context.bezierCurveTo(p1.X, p1.Y, p2.X, p2.Y, x1, y1);
		this.Context.stroke();
	}

	this.Serialize = function ()
	{
		var output = "";
		for (var k in this.Config)
		{
			output = output + ',' + this.Config[k].toString();
		}

		return output.substring(1);
	}
}


function rotatePoint(x, y, angle)
{
	var px = Math.cos(angle) * x - Math.sin(angle) * y;
	var py = Math.sin(angle) * x + Math.cos(angle) * y;

	return [px, py];
}
