<!--
{
    "Id": "Adnonymous-Lists",
	"WindowTitle": "",
	"Title": "Anonymous Lists in C#",
    "Date": "2011-10-10"
}
-->

This code is from a Gist I wrote when I was starting to use C#. It was one of those things that brought a "woah, dude" moment. Of course, you can actually implement this quite trivially with LINQ, but I didn't know that at the time!

	class AnonList
	{
	
		/// <summary>
		/// Creates a list of type T using a prototype object. Prototype can be any object, including an anonymous type. 
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="prototype">The prototype object, of which a List of the same type is returned</param>
		/// <returns>A new empty List of the same type as prototype</returns>
		public static List<T> CreateAnonList<T>(T prototype)
		{
			return new List<T>();
		}
	
	}

To use this:

	var k = new { A = 23, B = "Foo" };
	var list1 = AnonList.CreateAnonList(k);
	
	// of course, with a bit of LINQ, you can just do:
	// (although this also places the item in the list)
	var list2 = new [] { k }.ToList();
	
	list1.Dump();
	list2.Dump();