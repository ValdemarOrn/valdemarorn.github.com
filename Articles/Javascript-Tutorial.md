<!--
{
    "Id": "Javascript-Tutorial",
	"WindowTitle": "",
	"Title": "Javascript patterns and behavior demos",
    "Date": "2013-05-23"
}
-->


## About

Javascript patterns and behavior demos.
Copy each example into the Javascript window at [jsfiddle.net](http://jsfiddle.net/) and press "Run".

## Links and sources

* [JavaScript: The World's Most Misunderstood Programming Language](http://javascript.crockford.com/javascript.html)
* [Stack Overflow: What is the 'new' keyword in JavaScript?](http://stackoverflow.com/questions/1646698/what-is-the-new-keyword-in-javascript)
* [JavaScript Module Pattern: In-Depth](http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth)
* [JavaScript: Function Invocation Patterns](http://doctrina.org/Javascript-Function-Invocation-Patterns.html)


## Example 1 - What's "this" ? 

	// define a global value, valled "value"
	value = 'A';
	
	function x(){
	    alert(this.value);
	}
	
	// invoke x, but what does "this" point to?!
	x();
	
	// to show what "this" really is, try this:
	function whatsThis()
	{
	    alert(this === window);
	}
	
	// Prints "true", so we know that functions invoked directly are called int the scope of window 
	whatsThis();


## Example 1.5 - Extension Methods

	function alarm(){
	    alert(this.value);
	}
	
	// define an object that has a property called value
	var obj = new Object();
	obj.value = 'this is a string';
	obj.show = alarm;
	obj.show();
	
	
	// General rule: "this" points to whatever is to the left of the *dot*. 
	// If you're not calling object.method(), then the object is the "window".
	


## Example 2 - Object literals

	function x(){
	    alert(this.value);
	}
	
	// Creating an object with an object literal
	// Note that this is actually where JSON comes from, "Java Script Object Notation"
	var obj1 = { value: 'B', method: x };
	
	obj1.method();

## Example 3 - The "new" keyword

	function x(){
	    alert(this.value);
	}
	
	// creating an object with the "new" keyword. Creates a singleton object.
	var obj2 = new function(){
	    this.value = 'C';
	    this.method = x;
	}
	    
	obj2.method();

## Example 4 - Anonymous Closure

	(function(){
	
		// This code only exists within this function, and the function doesn't have a name
		alert('this code runs immediately');
		
		function f(x) {
			var y = 2 * x;
			alert(y);
		}
		
		f(5);
	
	})();
	
	if(typeof f === 'undefined')
	  alert('f is undefined');
	else
	  alert('f is defined');


## Example 5 - Using the module pattern to return an object 

	var obj3 = (function(){
	    
	    function getValue()
	    {
	        return 'E';
	    }
	    
		// note the "var" keyword
	    var theObject = {};
	    theObject.value = getValue();
	    theObject.method = function (){
			alert(this.value);
		};
	    return theObject;
	    
	})();
	
	obj3.method();
	
	// getValue is an internal method
	try
	{
	  obj3.getValue(); // error
	}
	catch(e)
	{
	  alert(e.message);
	}


## Example 6 - The "var" keyword and scope

	var a = (function(){
		var x1 = 50; // declare x1 using the "var" keyword
	  alert(x1);
	})();
	
	try
	{
		alert(x1); // exception, x1 only exists withing the function scope
	}
	catch(e)
	{
		alert(e.message);
	}
	
	var b = (function(){
		x2 = 100; // declare x2 without the "var" keyword
		alert(x2);
	})();
	
	alert(x2); // no exception, we declared x2 as a global variable! That's BAD


## Example 7 -  Creating a constructor function / object factory

	function myObject() {
	    this.value = 'F';
	    this.method = function(){ alert('Value: ' + this.value); };
	}
	
	var obj4 = new myObject(); // myObject isn't a class!! it's a contructor function!
	                           // The new keyword creates an empty object and feeds it to the constructor
	obj4.method();
	


## Example 8 -  Explicitly creating the object instead of using "new"
	
	function myObject() {
	    this.value = 'F';
	    this.method = function(){ alert('Value: ' + this.value); };
	}
	
	var obj5 = {};
	myObject.apply(obj5); // Apply is used to invoke a function *on* an object.
	obj5.value = 'G';     // When the function runs, "this" because whatever you applied to function to.
	obj5.method();
	
	// Point: there are no classes, just objects and constructors


## Example 9 - Monkey patching

	// There are no classes in javascript and all objects really are just dictionaries that may contain functions.
	// There is nothing stopping you from adding more stuff into that dictionary...
	Math.myfunc = function(x){ return 2*Math.abs(x); }
	Math["otherfunc"] = function(x){ return 10*x*x; }
	
	alert(Math.myfunc(4));
	alert(Math.otherfunc(5));
	
	// ... but it's not a very good idea.


## Example 10 - Prototypes

	Parent = function() {this.a = 'Value A';};
	
	obj1 = new Parent();
	alert(obj1.a);
	
	Child = function () {};
	
	// We can apply a "prototype" to the constructor
	// Any objects created with the Child contructor inherit this prototype
	Child.prototype = new Parent();
	Child.prototype.b = 'Value B';  
	
	var obj2 = new Child();
	alert(obj2.b);
	
	// If the object doesn't contain a value, the javascript engine then looks for that object in the prototype
	// this is a form of inheritance, but much different from the class-based inheritance that we are used to
	alert(obj2.a);
	
	// assigning to obj2.a does not change the prototype object, instead it creates a new property "a" on obj2
	// which hides the "a" property of the prototype
	obj2.a = 'Changed Value';
	alert(obj2.a);
	
	alert(obj1.a); // remains unchanged