
function Generator(fs)
{
	this.Samplerate = fs;
	
	this.StepLen = 5300;
	
	this.rad = 0.0;
	this.synthX = 0;
	this.kickX = 0;
	
	this.notes = [87, 0, 0, 85, 0, 0, 82, 0, 0, 80, 0, 0, 82, 0, 82, 0,            80, 0, 0, 82, 0, 0, 85, 0, 0, 78, 0, 0, 78, 0, 78, 0,];
	
	this.Delay = new Delay(this.StepLen * 2);
	
	this.Process = function(n)
	{
		var lastStep = Math.floor((n-1) / this.StepLen);
		var currentStep = Math.floor(n / this.StepLen);
		
		var trigger = (lastStep !== currentStep);
		
		if(trigger)
		{
			var note = this.notes[currentStep % this.notes.length];
			if(note !== 0)
			{
				this.synthX = 0;
				this.rad = Audio.Hz2Rad(Audio.Note2Hz(note), this.Samplerate);
			}
			
			if ((currentStep % 4) === 0)
			this.kickX = 0;
		}
		
		
		var sample = Math.sin(this.rad * this.synthX) * ( 1.0 / (1 + this.synthX / 500.0));
		sample = sample + 0.5 * this.Delay.Read();
		this.Delay.Write(sample);
		
		
		var kickHz = 150;
		kickHz = kickHz - this.kickX * 0.009;
		if(kickHz < 40)
			kickHz = 40;
			
		var kick = Math.sin(Audio.Hz2Rad(kickHz, this.Samplerate) * this.kickX);
		
		this.synthX++;
		this.kickX++;
		
		return sample + kick;
	}
	
}


Player = function(context)
{
  this.n = 0;
  this.context = context;
  this.node = context.createJavaScriptNode(128, 1, 1);

  var t = this;
  this.node.onaudioprocess = function(e) { t.Process(e) };
  
  this.Generator = new Generator(this.context.sampleRate);
}


Player.prototype.Process = function(e)
{
  var R = e.outputBuffer.getChannelData(0);
  var L = e.outputBuffer.getChannelData(1);

  for (var i = 0; i < L.length; ++i)
  {
    R[i] = L[i] = 0.5 * this.Generator.Process(this.n);
	this.n++;
  }
}

Player.prototype.Play = function() {
  this.node.connect(this.context.destination);
}

Player.prototype.Stop = function() {
  this.node.disconnect();
}

Player.prototype.Reset = function() {
  this.n = 0;
}

