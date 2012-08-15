
// Startup code
window.onload = function ()
{
	var canvas = document.getElementById("c");
	var m = new M.Main(canvas);
	m.Init();

	setInterval(function () { m.Process(); }, 10);
}

// Objects

M = {};
M.Particle = function (parent)
{
	this.Parent = parent;
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
		this.X = this.X + this.DirX * this.Speed;
		if (this.X < 0)
		{
			this.X = -this.X;
			this.DirX = -this.DirX;
		}
		else if (this.X > this.Parent.Width)
		{
			this.X = this.Parent.Width - Math.diff(this.X, this.Parent.Width);
			this.DirX = -this.DirX;
		}

		this.Y = this.Y + this.DirY * this.Speed;
		if (this.Y < 0)
		{
			this.Y = -this.Y;
			this.DirY = -this.DirY;
		}
		else if (this.Y > this.Parent.Height)
		{
			this.Y = this.Parent.Height - Math.diff(this.Y, this.Parent.Height);
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

	for (i = 0; i < count; i++)
	{
		var p = new M.Particle(parent);
		p.X = Math.random() * parent.Width;
		p.Y = Math.random() * parent.Height;
		p.DirX = Math.random() - 0.5;
		p.DirY = Math.random() - 0.5;
		p.Normalize();
		p.Speed = 0.2 + Math.random() * 3;
		this.Particles[i] = p;
	}

	this.Process = function (c)
	{
		var first = this.Particles[0];

		first.Move();
		var p = first;

		for (i = 1; i < this.Count; i++)
		{
			var prev = p;
			p = this.Particles[i];

			var colorMin = this.ColorIndex + 0.2 * i / this.Count;
			var colorMed = this.ColorIndex + 0.2 * (i + 0.5) / this.Count;
			var colorMax = this.ColorIndex + 0.2 * (i + 1.0) / this.Count;

			var grd = c.createLinearGradient(prev.X, prev.Y, p.X, p.Y);
			grd.addColorStop(0, this.GetColor(colorMin));
			grd.addColorStop(0.5, this.GetColor(colorMin));
			grd.addColorStop(1, this.GetColor(colorMin));
			c.strokeStyle = grd; // this.GetColor(this.ColorIndex);

			c.beginPath();
			c.moveTo(prev.X, prev.Y);
			c.lineTo(p.X, p.Y);

			if (i == this.Count - 1)
				c.lineTo(first.X, first.Y);
			c.stroke();
			p.Move();
		}

		this.ColorIndex += this.ColorSpeed;
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

	this.Curve = new M.Curve(this, Math.floor(10 + Math.random() * 40));

	this.Init = function ()
	{
		this.Canvas.width = this.Width;
		this.Canvas.height = this.Height;
	}

	this.Process = function ()
	{
		var c = this.Context;
		var p = this.Particle;

		// clear
		//c.beginPath();
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