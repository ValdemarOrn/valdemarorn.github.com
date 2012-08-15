
// Startup code
window.onload = function ()
{
	var canvas = document.getElementById("c");

	var m = new M.Main(canvas);
	m.Init();

	function resizeEvent()
	{
		canvas.width = window.innerWidth - 10;
		canvas.height = window.innerHeight - 70;
		m.Width = canvas.width;
		m.Height = canvas.height;
	}

	window.onresize = resizeEvent;
	resizeEvent();

	setInterval(function () { m.Process(); }, 10);
}

// Objects

M = {};
M.Particle = function (parent, curve)
{
	this.Parent = parent;
	this.Curve = curve;
	this.X = 0;
	this.Y = 0;
	this.DirX = 0;
	this.DirY = 0;
	this.Speed = 1.0;

	this.Normalize = function ()
	{
		var len = Math.sqrt(this.DirX * this.DirX + this.DirY * this.DirY);
		this.DirX = this.DirX / len;
		this.DirY = this.DirY / len;
	}

	this.Move = function ()
	{
		var minX = -this.Parent.Width * this.Curve.Spillover;
		var maxX = this.Parent.Width * (1 + this.Curve.Spillover);
		var minY = -this.Parent.Height * this.Curve.Spillover;
		var maxY = this.Parent.Height * (1 + this.Curve.Spillover);

		this.X = this.X + this.DirX * this.Speed * this.Parent.Width / 1000;
		if (this.X < minX)
		{
			this.X = minX + Math.diff(this.X, minX);
			this.DirX = -this.DirX;
		}
		else if (this.X > maxX)
		{
			this.X = maxX - Math.diff(this.X, maxX);
			this.DirX = -this.DirX;
		}

		this.Y = this.Y + this.DirY * this.Speed * this.Parent.Height / 600;
		if (this.Y < minY)
		{
			this.Y = minY + Math.diff(this.Y, minY);
			this.DirY = -this.DirY;
		}
		else if (this.Y > maxY)
		{
			this.Y = maxY - Math.diff(this.Y, maxY);
			this.DirY = -this.DirY;
		}
	}
}

M.Curve = function (parent, count)
{
	this.Parent = parent;
	this.Particles = new Array(count);
	this.Count = count;
	this.ColorIndex = Math.random();
	this.ColorSpeed = 0.003;

	// how many % outside the canvas the particles can move before bouncing
	this.Spillover = 0; 

	// Configurable options
	this.Bezier = false;

	this.Init = function ()
	{
		for (i = 0; i < count; i++)
		{
			var p = new M.Particle(this.Parent, this);
			p.X = Math.random() * this.Parent.Width;
			p.Y = Math.random() * this.Parent.Height;
			p.DirX = Math.random() - 0.5;
			p.DirY = Math.random() - 0.5;
			p.Normalize();
			p.Speed = 0.2 + Math.random() * 3;
			this.Particles[i] = p;
		}
	}

	this.Process = function (c)
	{
		var first = this.Particles[0];

		first.Move();
		var p = first;

		if (!this.Bezier)
		{
			for (i = 0; i < this.Count; i++)
			{
				var p0 = this.Particles[i];
				var p1 = this.Particles[(i + 1) % this.Count];

				var k0 = this.ColorLoop(i);
				var k1 = this.ColorLoop(i + 1);

				var colorMin = this.ColorIndex + 0.5 * k0 / this.Count;
				var colorMax = this.ColorIndex + 0.5 * k1 / this.Count;

				var grd = c.createLinearGradient(p0.X, p0.Y, p1.X, p1.Y);
				grd.addColorStop(0, this.GetColor(colorMin));
				grd.addColorStop(1, this.GetColor(colorMax));
				c.strokeStyle = grd; // this.GetColor(this.ColorIndex);

				c.beginPath();
				c.moveTo(p0.X, p0.Y);
				c.lineTo(p1.X, p1.Y);
				c.stroke();
			}
		}
		else
		{
			for (var i = 0; i < this.Count - 1; i = i + 2)
			{
				var p0 = this.Particles[i];
				var p1 = this.Particles[(i + 1) % this.Count];
				var p2 = this.Particles[(i + 2) % this.Count];
				var p3 = this.Particles[(i + 3) % this.Count];

				var k0 = this.ColorLoop(i);
				var k1 = this.ColorLoop((i + 2) % this.Count);

				var colorMin = this.ColorIndex + 0.5 * k0 / this.Count;
				var colorMax = this.ColorIndex + 0.5 * k1 / this.Count;

				var x0 = (p0.X + p1.X) / 2;
				var y0 = (p0.Y + p1.Y) / 2;

				var x1 = (p2.X + p3.X) / 2;
				var y1 = (p2.Y + p3.Y) / 2;

				var grd = c.createLinearGradient(x0, y0, x1, y1);
				grd.addColorStop(0, this.GetColor(colorMin));
				grd.addColorStop(1, this.GetColor(colorMax));
				c.strokeStyle = grd; // this.GetColor(this.ColorIndex);

				c.beginPath();
				c.moveTo(x0, y0);
				c.bezierCurveTo(p1.X, p1.Y, p2.X, p2.Y, x1, y1);
				c.stroke();
			}
		}

		for (i = 0; i < this.Count; i++)
			this.Particles[i].Move();

		this.ColorIndex += this.ColorSpeed;
	}

	// maps point 0...n to 0...n/2...0
	this.ColorLoop = function (i)
	{
		if (this.Count % 2 == 0)
			var k = (i < this.Count / 2) ? i : (this.Count - 1 - i);
		else
			var k = (i < this.Count / 2) ? i : (this.Count - i);

		return k;
	}

	this.GetColor = function (index)
	{
		index = index % 1.0;
		var colors = hsvToRgb(index * 360, 80, 100);
		var r = colors[0].toString(16);
		var g = colors[1].toString(16);
		var b = colors[2].toString(16);

		if (r.length == 1)
			r = "0" + r;
		if (g.length == 1)
			g = "0" + g;
		if (b.length == 1)
			b = "0" + b;

		var output = "#" + r + g + b;
		return output;
	}

}

M.Main = function (canvas)
{
	this.Canvas = canvas;
	this.Context = canvas.getContext("2d");
	this.Width = 1000;
	this.Height = 700;

	var points = Math.floor(4 + Math.random() * 10);
	if (points % 2 !== 0) // numbers of points must be even when using bezier curves, otherwise the curve won't close
		points++;

	this.Curve = new M.Curve(this, points);

	this.Init = function ()
	{
		this.Curve.Init();
		this.Curve.Bezier = (Math.random() >= 0.5);
		if (this.Curve.Bezier)
			this.Curve.Spillover = 0.00;

		this.Canvas.width = this.Width;
		this.Canvas.height = this.Height;
	}

	this.Process = function ()
	{
		var c = this.Context;
		var p = this.Particle;

		// zoom effect
		c.drawImage(this.Canvas, -4, -4, this.Width + 8, this.Height + 8);

		c.beginPath();
		c.fillStyle = "rgba(0, 0, 0, 0.1)";
		c.rect(-5, -5, this.Width + 10, this.Height + 10);
		c.fill();

		this.Curve.Process(c);
	}
}



Math.diff = function (a, b)
{
	return Math.abs(a - b);
}

/**
* HSV to RGB color conversion
*
* H runs from 0 to 360 degrees
* S and V run from 0 to 100
* 
* Ported from the excellent java algorithm by Eugene Vishnevsky at:
* http://www.cs.rit.edu/~ncs/color/t_convert.html
*/
function hsvToRgb(h, s, v)
{
	var r, g, b;
	var i;
	var f, p, q, t;

	// Make sure our arguments stay in-range
	h = Math.max(0, Math.min(360, h));
	s = Math.max(0, Math.min(100, s));
	v = Math.max(0, Math.min(100, v));

	// We accept saturation and value arguments from 0 to 100 because that's
	// how Photoshop represents those values. Internally, however, the
	// saturation and value are calculated from a range of 0 to 1. We make
	// That conversion here.
	s /= 100;
	v /= 100;

	if (s == 0)
	{
		// Achromatic (grey)
		r = g = b = v;
		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}

	h /= 60; // sector 0 to 5
	i = Math.floor(h);
	f = h - i; // factorial part of h
	p = v * (1 - s);
	q = v * (1 - s * f);
	t = v * (1 - s * (1 - f));

	switch (i)
	{
		case 0:
			r = v;
			g = t;
			b = p;
			break;

		case 1:
			r = q;
			g = v;
			b = p;
			break;

		case 2:
			r = p;
			g = v;
			b = t;
			break;

		case 3:
			r = p;
			g = q;
			b = v;
			break;

		case 4:
			r = t;
			g = p;
			b = v;
			break;

		default: // case 5:
			r = v;
			g = p;
			b = q;
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}