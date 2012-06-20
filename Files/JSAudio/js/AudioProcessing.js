


var Audio = new function()
{
	this.Note2Hz = function(note)
	{	
		return 440.0 * Math.pow(2,(note-69)/12.0);
	};
	
	this.Hz2Rad = function(Hz, fs)
	{	
		return Hz / fs * 2.0 * Math.PI;
	};
	
}



var Delay = function(del)
{
	var memory = new Array();
	
	for(i=0; i<del; i++)
	{
		memory[i] = 0.0;
	}
	
	var i = 0;
	
	this.Write = function(sample)
	{
		memory[i] = sample;
		i = (i + 1) % del;
	}
	
	this.Read = function()
	{
		return memory[i];
	}

}