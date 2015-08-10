<!--
{
    "Id": "Readonly-in-CSharp",
	"WindowTitle": "",
	"Title": "Just how read-only is \"readonly\" in C#?",
    "Date": "2013-07-04"
}
-->

Have you ever stopped to think how the readonly keyword works under the hood? Did you realize that it's only syntactic sugar to stop you from accidentally overwriting an invariant constant?

Don't believe me? Try it yourself:

	class Program
	{
	    public readonly int Val;
	
	    public Program()
	    {
	        Val = 42;
	    }
	
	    static void Main(string[] args)
	    {
	        var p = new Program();
	        var now = p.Val;
	
	        // This is a compile-time error
	        p.Val = 45; // try commenting out this line, see what happens...
	
	        // But this works just fine
	        p.GetType().GetField("Val").SetValue(p, 43);
	        var after = p.Val;
			Console.WriteLine("Val is {0}", p.Val);
	    }
	}