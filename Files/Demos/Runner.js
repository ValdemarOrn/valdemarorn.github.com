
// Startup code
window.onload = function ()
{
	var canvas = document.getElementById("c");

	var m = new M.Main(canvas);
	m.Init();

	/*function resizeEvent()
	{
		canvas.width = window.innerWidth - 10;
		canvas.height = window.innerHeight - 100;
		m.Width = canvas.width;
		m.Height = canvas.height;
	}*/

	//window.onresize = resizeEvent;
	//resizeEvent();

	setInterval(function () { m.Process(); }, 10);
}

// Objects

M = {};

M.Entity = function (parent)
{
	this.Parent = parent;
	this.X = Math.random() * parent.Width - parent.Width;
	this.Y = Math.random() * parent.Height;
	this.Speed = 5 + Math.random() * 20;
	this.Vertical = false;
	this.Width = 25;
	this.Height = 4;

	

	this.Move = function ()
	{
	    if (this.Vertical)
	    {
	        this.Y = this.Y + this.Speed;
	        if (this.Y > this.Parent.Height)
	        {
	            this.Y = this.Y - this.Parent.Height - this.Height;
	            this.X = Math.random() * this.Parent.Width;
	        }
	    }
	    else
	    {
	        this.X = this.X + this.Speed;
	        if (this.X > this.Parent.Width)
	        {
	            this.X = this.X - this.Parent.Width - this.Width;
	            this.Y = Math.random() * parent.Height;
	        }
	    }
	}

	this.Process = function (ctx)
	{
	    this.Move();

	    var hue = this.Parent.ColorIndex + (this.Y / this.Parent.Height) * this.Parent.ColorSpan;
	    hue = hue % 360;

	    var rgb = hsvToRgb(hue, 100, 100);

	    for (var i = 0; i < 1; i++)
	    {
	        var p = 1 + i / 2;
	        p = p * p * this.Speed / 20;
	        var alpha = Math.exp(-i * 0.1);
	        var size = Math.exp(-i * 0.02);

	        ctx.beginPath();
	        
	        ctx.fillStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ", " + alpha + ")";
	        ctx.rect(this.X - p, this.Y, this.Width, this.Height);

	        ctx.fill();
	    }
	}
}

M.Main = function (canvas)
{
	this.Canvas = canvas;
	this.Context = canvas.getContext("2d");
	this.Width = 1900;
	this.Height = 1000;

	this.ColorIndex = 0;
	this.ColorSpan = 360 / 2;

	this.Entities = new Array(50);
	

	this.Init = function ()
	{
	    for (i = 0; i < this.Entities.length; i++)
	    {
	        var e = new M.Entity(this);

	        this.Entities[i] = e;
	    }

		this.Canvas.width = this.Width;
		this.Canvas.height = this.Height;
	}

	this.Process = function ()
	{
		var c = this.Context;
		var p = this.Particle;

		//c.drawImage(this.Canvas, -4, 0, this.Width, this.Height);

		c.beginPath();
		c.fillStyle = "rgba(0, 0, 0, 0.05)";
		c.rect(0, 0, this.Width, this.Height);
		c.fill();

		for (i = 0; i < this.Entities.length; i++)
		{
		    this.Entities[i].Process(c);
		}

		this.ColorIndex++;
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
