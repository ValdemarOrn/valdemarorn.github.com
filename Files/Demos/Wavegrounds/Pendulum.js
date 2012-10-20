/// <reference path="jquery-1.7.1.intellisense.js"/>
/// <reference path="jquery-1.7.1.js" />

// Model

if(typeof M === "undefined")
	M = {};

M.VersionInfo = '0.8.0';

M.ConfigInfo =
{
	CanvasWidth:        { def: 1000,     min: 100,           max: 10000,        type: 'limit',      scale: 10,     precision: 0 },
	CanvasHeight:       { def: 1000,     min: 100,           max: 10000,        type: 'limit',      scale: 10,     precision: 0 },
	CanvasScale:        { def: 100,      min: 1,             max: 300,          type: 'limit',      scale: 1,      precision: 0 },
	BackgroundColor:    { def: "#FFFFFF",min: "",            max: "",           type: 'color',      scale: 0,      precision: 0 },
	LineColor:          { def: "#000000",min: "",            max: "",           type: 'color',      scale: 0,      precision: 0 },
	LineOpacity:        { def: 200,      min: 0,             max: 255,          type: 'limit',      scale: 1,      precision: 0 },
	LineThickness:      { def: 0.4,      min: 0.01,          max: 30,           type: 'limit',      scale: 0.05,   precision: 2 },
	
	Precision:          { def: 300,      min: 100,           max: 5000,         type: 'limit',      scale: 50,     precision: 0 },

	StartTime:          { def: 0,        min: -10,           max: 100,          type: 'limit',      scale: 0.05,   precision: 3 },
	SimulationTime:     { def: 100,      min: 0,             max: 1000,         type: 'explimit',   scale: 0.01,   precision: 3 },
	
	XSize:              { def: 0.8,      min: 0.1,           max: 10,           type: 'explimit',   scale: 0.02,   precision: 2 },
	YSize:              { def: 0.5,      min: 0.1,           max: 10,           type: 'explimit',   scale: 0.02,   precision: 2 },
	XSwingPhase:        { def: 0.0,      min: -Math.PI,      max: Math.PI,      type: 'limit',      scale: 0.02,   precision: 2 },
	YSwingPhase:        { def: 0.0,      min: -Math.PI,      max: Math.PI,      type: 'limit',      scale: 0.02,   precision: 2 },
	
	XSwingSpeed:        { def: 1,        min: 0,             max: 100,          type: 'explimit',   scale: 0.01,   precision: 5 },
	YSwingSpeed:        { def: 1,        min: 0,             max: 100,          type: 'explimit',   scale: 0.01,   precision: 5 },
	
	XPModulation:       { def: 0.0,      min: 0,             max: 10,           type: 'limit',      scale: 0.01,   precision: 3 },
	YPModulation:       { def: 0.0,      min: 0,             max: 10,           type: 'limit',      scale: 0.01,   precision: 3 },
	XPModulationSpeed:  { def: 0.001,    min: 0,             max: 0.1,          type: 'explimit',   scale: 0.01,   precision: 4 },
	YPModulationSpeed:  { def: 0.001,    min: 0,             max: 0.1,          type: 'explimit',   scale: 0.01,   precision: 4 },
	XPModulationPhase:  { def: 0,        min: -Math.PI,      max: Math.PI,      type: 'limit',      scale: 0.02,   precision: 4 },
	YPModulationPhase:  { def: 0,        min: -Math.PI,      max: Math.PI,      type: 'limit',      scale: 0.02,   precision: 4 },
	
	XAModulation:       { def: 0.0,      min: 0,             max: 1,            type: 'limit',      scale: 0.002,  precision: 3 },
	YAModulation:       { def: 0.0,      min: 0,             max: 1,            type: 'limit',      scale: 0.002,  precision: 3 },
	XAModulationSpeed:  { def: 0.001,    min: 0,             max: 100,          type: 'explimit',   scale: 0.01,   precision: 4 },
	YAModulationSpeed:  { def: 0.001,    min: 0,             max: 100,          type: 'explimit',   scale: 0.01,   precision: 4 },
	XAModulationPhase:  { def: 0,        min: -Math.PI,      max: Math.PI,      type: 'limit',      scale: 0.02,   precision: 4 },
	YAModulationPhase:  { def: 0,        min: -Math.PI,      max: Math.PI,      type: 'limit',      scale: 0.02,   precision: 4 },

	XDecayRate:         { def: 0.00001,  min: 0,             max: 1,            type: 'explimit',   scale: 0.01,   precision: 4 },
	YDecayRate:         { def: 0.00001,  min: 0,             max: 1,            type: 'explimit',   scale: 0.01,   precision: 4 },
	
	RotationSpeed:      { def: 0.004,    min: -3,            max: 3,            type: 'limit',      scale: 0.002,  precision: 3 },
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
	
	LineSpeedMin:       { def: 0.0,      min: 0.001,         max: 1.0,          type: 'explimit',   scale: 0.01,   precision: 4 },
	LineSpeedDecay:     { def: 0.1,      min: 0.01,          max: 1,            type: 'explimit',   scale: 0.01,   precision: 3 },
	LineSpeedColor:     { def: "#000000",min: "",            max: "",           type: 'color',      scale: 0,      precision: 0 },
	LineSpeedOpacity:   { def: 1.0,      min: 0.0,           max: 10,           type: 'explimit',   scale: 0.02,   precision: 3 },
	LineSpeedThickness: { def: 1.0,      min: 0.0,           max: 10,           type: 'explimit',   scale: 0.02,   precision: 3 },

	LineTimeMin:        { def: 0.0,      min: 0.0,           max: 100,          type: 'explimit',   scale: 0.01,   precision: 3 },
	LineTimeDecay:      { def: 0.1,      min: 0.01,          max: 1,            type: 'explimit',   scale: 0.01,   precision: 3 },
	LineTimeColor:      { def: "#000000",min: "",            max: "",           type: 'color',      scale: 0,      precision: 0 },
	LineTimeOpacity:    { def: 1.0,      min: 0.0,           max: 10,           type: 'explimit',   scale: 0.02,   precision: 3 },
	LineTimeThickness:  { def: 1.0,      min: 0.0,           max: 10,           type: 'explimit',   scale: 0.02,   precision: 3 },

	ColorPickR:         { def: 255,      min: 0,             max: 255,          type: 'limit',      scale: 1,      precision: 0 },
	ColorPickG:         { def: 255,      min: 0,             max: 255,          type: 'limit',      scale: 1,      precision: 0 },
	ColorPickB:         { def: 255,      min: 0,             max: 255,          type: 'limit',      scale: 1,      precision: 0 },

	ColorPickH:         { def: 255,      min: 0,             max: 360,          type: 'limit',      scale: 1,      precision: 0 },
	ColorPickS:         { def: 255,      min: 0,             max: 100,          type: 'limit',      scale: 1,      precision: 0 },
	ColorPickV:         { def: 255,      min: 0,             max: 100,          type: 'limit',      scale: 1,      precision: 0 },
};

M.Labels =
{
	CanvasWidth: "Canvas Width",
	CanvasHeight: "Canvas Height",
	CanvasScale: "Canvas Scale",
	BackgroundColor: "Background Color",
	LineColor: "Line Color",
	LineOpacity: "Line Opacity",
	LineThickness: "Line Thickness",
	
	Precision: "Precision",

	StartTime: "Start Time",
	SimulationTime: "Simulation Time",
	
	XSize: "X-Axis Diameter",
	YSize: "Y-Axis Diameter",
	XSwingPhase: "X-Axis Phase",
	YSwingPhase: "Y-Axis Phase",
	
	XSwingSpeed: "X-Axis Frequency",
	YSwingSpeed: "Y-Axis Frequency",
	
	XPModulation: "X-Axis Modulation",
	YPModulation: "Y-Axis Modulation",
	XPModulationSpeed: "X-Axis Mod. Freq.",
	YPModulationSpeed: "Y-Axis Mod. Freq.",
	XPModulationPhase: "X-Axis Mod. Phase",
	YPModulationPhase: "Y-Axis Mod. Phase",

	XAModulation: "X-Axis Modulation",
	YAModulation: "Y-Axis Modulation",
	XAModulationSpeed: "X-Axis Mod. Freq.",
	YAModulationSpeed: "Y-Axis Mod. Freq.",
	XAModulationPhase: "X-Axis Mod. Phase",
	YAModulationPhase: "Y-Axis Mod. Phase",
	
	XDecayRate: "X-Axis Decay Rate",
	YDecayRate: "Y-Axis Decay Rate",
	
	RotationSpeed: "Rotation Speed",
	RotationPhase: "Rotation Phase",
	
	RotationMod: "Rotation Modulation",
	RotationModSpeed: "Rotation Mod. Speed",
	RotationModPhase: "Rotation Mod. Phase",
	
	PlaneAngleX: "Plane Angle X-Axis",
	PlaneAngleY: "Plane Angle Y-Axis",
	PlaneHeight: "Plane Height",

	PanX: "Pan X-Axis",
	PanY: "Pan Y-Axis",
	Zoom: "Zoom",
	Rotate: "Rotate",
	
	LineSpeedMin: "Speed Minimum",
	LineSpeedDecay: "Rate of Change",
	LineSpeedColor: "Color",
	LineSpeedOpacity: "Opacity Multiplier",
	LineSpeedThickness: "Thickness Multiplier",

	LineTimeMin: "Time Minimum",
	LineTimeDecay: "Rate of Change",
	LineTimeColor: "Color",
	LineTimeOpacity: "Opacity Multiplier",
	LineTimeThickness: "Thickness Multiplier",

	ColorPickR: "Red",
	ColorPickG: "Green",
	ColorPickB: "Blue",

	ColorPickH: "Hue",
	ColorPickS: "Saturation",
	ColorPickV: "Value",
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
		BackgroundColor: "#FFFFFF",
		LineColor: "#000000",
		LineOpacity: 200,
		LineThickness: 0.5,

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


		// x/y-axis amplitude modulation strength, percentage
		XPModulation: 0.0,
		YPModulation: 0.0,
		// ellipse x/y-axis amplitude modulation speed, in revolutions /sec ( 2*PI*rad/sec )
		XPModulationSpeed: 0.001,
		YPModulationSpeed: 0.001,
		// ellipse x/y-axis amplitude modulation initial phase, in radians
		XPModulationPhase: 0,
		YPModulationPhase: 0,


		// x/y-axis amplitude modulation strength, percentage
		XAModulation: 0.0,
		YAModulation: 0.0,
		// ellipse x/y-axis amplitude modulation speed, in revolutions /sec ( 2*PI*rad/sec )
		XAModulationSpeed: 0.001,
		YAModulationSpeed: 0.001,
		// ellipse x/y-axis amplitude modulation initial phase, in radians
		XAModulationPhase: 0,
		YAModulationPhase: 0,


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

		// Rotates every point around the origin, radians
		Rotate: 0.0,

		// Vary line style by speed
		LineSpeedMin: 0.0,
		LineSpeedDecay: 0.1,
		LineSpeedColor: "#000000",
		LineSpeedOpacity: 50,
		LineSpeedThickness: 0.05,

		// Vary line style by time
		LineTimeMin: 0.0,
		LineTimeDecay: 0.1,
		LineTimeColor: "#000000",
		LineTimeOpacity: 50,
		LineTimeThickness: 0.05,

		ColorPickR: 255,
		ColorPickG: 255,
		ColorPickB: 255,

		ColorPickH: 270,
		ColorPickS: 100,
		ColorPickV: 100
	};

	this.Settings =
	{
		SwingSpeedEnabled: false,
		SwingPMEnabled: false,
		SwingAMEnabled: false,
		DecayRateEnabled: true,
		RotationEnabled: true,
		RotationModEnabled: false,
		PlaneAngleEnabled: false,
		LineSpeedStyleEnabled: false,
		LineTimeStyleEnabled: false
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
		var settings = this.Settings;

		if (cfg.CanvasWidth !== this.Width)
			this.ResizeCanvas();
		if (cfg.CanvasHeight !== this.Height)
			this.ResizeCanvas();
		if (cfg.CanvasScale !== this.CanvasScale)
			this.ScaleCanvas();

		this.SetStyle(DecomposeColor(cfg.LineColor), cfg.LineThickness, cfg.LineOpacity);

		var i = this.n;
		this.n = this.n + 1000;

		if (this.n > cfg.Precision * (cfg.SimulationTime + cfg.StartTime))
			this.n = cfg.Precision * (cfg.SimulationTime + cfg.StartTime);
		
		// -----------------------------------------------------------
		// ------------------- Main Prcessing Loop -------------------
		// -----------------------------------------------------------

		while (i < this.n)
		{
			var t = i / cfg.Precision;
			
			if (settings.SwingSpeedEnabled)
			{
				var cycleX = t * 2 * Math.PI * cfg.XSwingSpeed + cfg.XSwingPhase;
				var cycleY = t * 2 * Math.PI * cfg.YSwingSpeed + cfg.YSwingPhase;
			}
			else
			{
				var cycleX = t * 2 * Math.PI + cfg.XSwingPhase;
				var cycleY = t * 2 * Math.PI + cfg.YSwingPhase;
			}

			// Swing PM modulation
			if (settings.SwingPMEnabled)
			{
				var cycleXPMod = t * 2 * Math.PI * cfg.XPModulationSpeed + cfg.XPModulationPhase;
				var cycleYPMod = t * 2 * Math.PI * cfg.YPModulationSpeed + cfg.YPModulationPhase;
				var modXP = cfg.XPModulation * Math.sin(cycleXPMod);
				var modYP = cfg.YPModulation * Math.sin(cycleYPMod);
				cycleX = cycleX + modXP;
				cycleY = cycleY + modYP;
			}

			// swing
			var x = (cfg.XSize * this.Width / 2) * Math.cos(cycleX);
			var y = (cfg.YSize * this.Height / 2) * Math.sin(cycleY);

			// Swing AM modulation
			if (settings.SwingAMEnabled)
			{
				var cycleXMod = t * 2 * Math.PI * cfg.XAModulationSpeed + cfg.XAModulationPhase;
				var cycleYMod = t * 2 * Math.PI * cfg.YAModulationSpeed + cfg.YAModulationPhase;
				var modX = (1 - cfg.XAModulation) + cfg.XAModulation * Math.cos(cycleXMod);
				var modY = (1 - cfg.YAModulation) + cfg.YAModulation * Math.cos(cycleYMod);
				x = x * modX;
				y = y * modY;
			}

			// decay
			if (settings.DecayRateEnabled)
			{
				var decayX = Math.pow(1 - cfg.XDecayRate, t);
				var decayY = Math.pow(1 - cfg.YDecayRate, t);
				x = x * decayX;
				y = y * decayY;
			}

			// rotation modulation
			if (settings.RotationModEnabled)
			{
				var rotModAngle = t * 2 * Math.PI * cfg.RotationModSpeed + cfg.RotationModPhase;
				var rotMod = cfg.RotationMod * Math.cos(rotModAngle);
			}
			else
			{
				var rotMod = 0;
			}

			// rotation
			if (settings.RotationEnabled)
			{
				var rotateAngle = t * 2 * Math.PI * cfg.RotationSpeed + cfg.RotationPhase + rotMod;
				var rotated = rotatePoint(x, y, rotateAngle);
				x = rotated[0];
				y = rotated[1];
			}

			// plane transformation
			if (settings.PlaneAngleEnabled)
			{
				var transformed = this.PlaneTransform(x, y);
				x = transformed[0];
				y = transformed[1];
			}

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

			this.Draw(x, y, t);

			i++;
		}
	}

	this.Reset = function ()
	{
		this.Points = [null, null, null, null, null];
		var c = this.Context;
		c.beginPath();
		c.fillStyle = this.Config.BackgroundColor;
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

	this.Draw = function (x, y, t)
	{
		// Push new point to the end of the point queue
		this.Points[0] = this.Points[1];
		this.Points[1] = this.Points[2];
		this.Points[2] = this.Points[3];
		this.Points[3] = this.Points[4];
		this.Points[4] = { X: x, Y: y };

		if (this.Points[0] == null)
			return;

		this.DrawBezier(t);
	}

	this.DrawDot = function (t)
	{
		this.Context.beginPath();
		this.Context.arc(this.Points[0].X, this.Points[0].Y, this.Radius, 0, 2 * Math.PI, false);
		this.Context.fill();
	}

	this.DrawBezier = function (t)
	{
		var p0 = this.Points[0];
		var p1 = this.Points[1];
		var p2 = this.Points[2];
		var p3 = this.Points[3];

		var x0 = (p0.X + p1.X) / 2;
		var y0 = (p0.Y + p1.Y) / 2;

		var x1 = (p2.X + p3.X) / 2;
		var y1 = (p2.Y + p3.Y) / 2;

		var len = Math.abs(x1 - x0) * Math.abs(x1 - x0) + Math.abs(y1 - y0) * Math.abs(y1 - y0)
		len = Math.sqrt(len);
		var velocity = len;

		if (this.Settings.LineSpeedStyleEnabled || this.Settings.LineTimeStyleEnabled)
			this.CreateLineStyle(t, velocity);

		this.Context.beginPath();
		this.Context.moveTo(x0, y0);
		this.Context.bezierCurveTo(p1.X, p1.Y, p2.X, p2.Y, x1, y1);
		this.Context.stroke();
	}

	/// t = the time at which we want this style
	/// v = velocity of the curve at that time
	this.CreateLineStyle = function (t, v)
	{
		var cfg = this.Config;

		var colorRGB = DecomposeColor(cfg.LineColor);
		var thickness = cfg.LineThickness;
		var opacity = cfg.LineOpacity;

		if (this.Settings.LineSpeedStyleEnabled)
		{
			var min = cfg.LineSpeedMin / this.Config.Precision * 50000;
			var exponent = 1 - cfg.LineSpeedDecay;

			var exp = Math.pow(exponent, v - min);
			if (v < min)
				exp = 1.0;

			// mix the color
			var colorTime = DecomposeColor(cfg.LineSpeedColor);
			colorRGB[0] = colorRGB[0] * exp + colorTime[0] * (1 - exp);
			colorRGB[1] = colorRGB[1] * exp + colorTime[1] * (1 - exp);
			colorRGB[2] = colorRGB[2] * exp + colorTime[2] * (1 - exp);

			// blend line width
			thickness = thickness * exp + thickness * cfg.LineSpeedThickness * (1 - exp);

			// blend line opacity
			opacity = opacity * exp + opacity * cfg.LineSpeedOpacity * (1 - exp);
		}

		if(this.Settings.LineTimeStyleEnabled)
		{
			var min = cfg.LineTimeMin;
			var exponent = 1 - cfg.LineTimeDecay;
			
			var exp = Math.pow(exponent, t - min);
			if(t < min)
				exp = 1.0;

			// mix the color
			var colorTime = DecomposeColor(cfg.LineTimeColor);
			colorRGB[0] = colorRGB[0] * exp + colorTime[0] * (1 - exp);
			colorRGB[1] = colorRGB[1] * exp + colorTime[1] * (1 - exp);
			colorRGB[2] = colorRGB[2] * exp + colorTime[2] * (1 - exp);

			// blend line width
			thickness = thickness * exp + thickness * cfg.LineTimeThickness * (1 - exp);

			// blend line opacity
			opacity = opacity * exp + opacity * cfg.LineTimeOpacity * (1 - exp);
		}

		this.SetStyle(colorRGB, thickness, opacity);
	}

	this.SetStyle = function(RGBArray, thickness, opacity)
	{
		RGBArray[0] = Math.round(RGBArray[0]);
		RGBArray[1] = Math.round(RGBArray[1]);
		RGBArray[2] = Math.round(RGBArray[2]);

		if (RGBArray[0] < 0)
			RGBArray[0] = 0;
		if (RGBArray[1] < 0)
			RGBArray[1] = 0;
		if (RGBArray[2] < 0)
			RGBArray[2] = 0;

		if (RGBArray[0] > 255)
			RGBArray[0] = 255;
		if (RGBArray[1] > 255)
			RGBArray[1] = 255;
		if (RGBArray[2] > 255)
			RGBArray[2] = 255;

		var color = RGBArray;
		var alpha = Math.roundTo(opacity / 255.0, 2).toString();
		var rgbaStr = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + alpha + ')';

		this.Context.strokeStyle = rgbaStr;
		this.Context.lineWidth = thickness;
	}

	this.Serialize = function ()
	{
		var config = '';
		for (var k in this.Config)
		{
			if(M.ConfigInfo[k].type === 'color')
				var str = this.Config[k].toString();
			else
				var str = Math.roundTo(this.Config[k], 5).toString();

			if (str.length > 7)
				str = str.substring(0, 7);

			config = config + ',' + str;
		}

		config = config.substring(1);

		var settings = '';
		for (var k in this.Settings)
		{
			if (this.Settings[k] === true)
				settings = settings + 'T';
			else
				settings = settings + 'F';
		}

		return { Config: config, Settings: settings };
	}

	this.Deserialize = function (version, config, settings)
	{
		config = config.split(',');

		var i = 0;
		for (var k in this.Config)
		{
			if (M.ConfigInfo[k].type === 'color')
				this.Config[k] = config[i];
			else
				this.Config[k] = Number(config[i]);

			i++;
		}

		i = 0;
		for (var k in this.Settings)
		{
			this.Settings[k] = (settings.charAt(i) === 'T') ? true : false;
			i++;
		}
	}

}


function rotatePoint(x, y, angle)
{
	var px = Math.cos(angle) * x - Math.sin(angle) * y;
	var py = Math.sin(angle) * x + Math.cos(angle) * y;

	return [px, py];
}

function DecomposeColor(colorVal)
{
	colorVal = colorVal.replace('#', '');
	if (colorVal.length == 3)
	{
		var R = parseInt(colorVal.substring(0, 1), 16) * 16;
		var G = parseInt(colorVal.substring(1, 2), 16) * 16;
		var B = parseInt(colorVal.substring(2, 3), 16) * 16;
		return [R, G, B];
	}
	else
	{
		var R = parseInt(colorVal.substring(0, 2), 16);
		var G = parseInt(colorVal.substring(2, 4), 16);
		var B = parseInt(colorVal.substring(4, 6), 16);
		return [R, G, B];
	}
	
}

Math.roundTo = function (number, decimalPlaces)
{
	var factor = Math.pow(10, decimalPlaces);
	return Math.round(number * factor) / factor;
};