# Javascript Coding Standard - Work in progress

## A. Style

### A.1

**Always** declare variables using the "var" keyword. Failure to do so should be considered an error

- Note: Do remember to use "var" in for loops: for(var x in list)

- Reason: Prevent the global context from filling up with garbage, prevent overwriting other variables.

### A.2
	
Prefer initializing arrays with [] instead of new Array();

### A.3

Prefer initializing objects with {} instead of new Object();	

### A.4

Do initialize variables to a default value

- Reason: Prevents undefined exceptions, helps Visual Studio Intellisense determine the type, which improves auto-completion capabilities.
	
### A.5

Avoid using non-strict equality operators whenever possible.
Always prefer strict equality ( === and !== )

- Reason: When using == and != operators, Javascript will perform implicit type-casting, which can result in odd/undefined behaviour.

- See: [http://bonsaiden.github.com/JavaScript-Garden/#types.equality](http://bonsaiden.github.com/JavaScript-Garden/#types.equality)

### A.6

Prefer accessing properties with obj.propertyName instead of obj["propertyName"] if the property name is known at design time.

- Exception: use obj["propertyName"] if the object is indeed used as an associative array / dictionary.

### A.7

Prefer "//" style comments over /* */

- Reason: Easier to comment out blocks of code while developing.
	
### A.8

Use four (4) spaces to indent blocks of code

### A.9

Do use single quotes (' ') for strings

- Reason: html tags use double quotes (" ") so single quotes do not interfere with html code when dynamically creating html tags at runtime
	
### A.10

Always use semicolons to end simple statements. Do not use semicolons to end function declarations, unless using the explici assignment format.

- Example: var myFunction = function() {}; // explicit assignment to myFunction

- Reason: Limit unintended consequences of javascript's implicit semicolon insertion
	
### A.11

Always place opening braces for statement blocks on the same line as the conditional

- Reason: Javascript will automatically terminate the statement if it finds a newline, so in many cases, inserting a line break will result in modifed code behaviour
	
### A.12

Use camelCase for function names, variables and properties. Use PascalCase for constructor functions and namespace objects.

- Reason: Makes it obvious which functions are constructors functions.




## B. Conventions & Best Practices

### B.1

Prefer putting code in anonymous closures whenever possible

- Reason: Prevent global context pollution.

- Example:

		(function(){
		    // insert your code here. Any variables of functions defined here 
		    // will not be visible in the global scope.
		})();

### B.2

Do check for undefined variables using (typeof variable === 'undefined')

- Reason: It is the only safe method to check for undefined variables.

### B.3

Define methods using the constructors prototype.

- Reason: It is more efficient to define functions and assign them to a single prototype object than to create function instances for every object.

### B.4

Avoid defining temporary placeholders for "this". Prefer defining a single property inside the scope that points to itself.
Alternatively, pass the current context into the callback as an argument, circumventing the problem altogether.

- Reason: things like "var that = this" are ugly and it's too easy to forget what the current context is (what "this" points to).
	Using "self" to refer to the context is a good solution to these problems.

- Example:

		var myObject = new function() {
			var self = this;
			// other code here, use "self" to refer to the current context if you have callbacks
		}
		
### B.5

Avoid using instanceof to determine the "type" of object

- Reason: instanceof can be misleading, especially if the object was constructed inside an anonymous function. Two identical objects defined inside such a scope may not necessarily match when using instanceof. Prototype objects can also be overwritten. Try to embrace Javascript's dynamic nature and accept the fact that there are no classes in javascript!

### B.6

Prefer using objects to namespace your code

- Reason: Promotes code structure

- Example:

		Company = Company || {}; // check if Company already exists else create a new object.
		Company.companyName = "My Company"; // Use Company as a container for my code
		Company.SomeConstructor = function(){ };
	
### B.7

Avoid defining variables inside conditional or loop blocks

- Reason: Javascript is **not** block scoped, it is function scoped, unlike most languages we're familiar with. 
	This can cause confusion and makes code hard to read. Variables will "leak" into the function scope. 
	Place variable definitions at the function block level.
	
### B.8

Do **not** define functions inside conditionals or loop blocks

- Reason: Same as above. Also, functions defined inside loop blocks will actually cause a new function to be created 
  for every iteration of the loop, causing massive overhead.
	
### B.9

Do **not** use eval()

- Reason: Makes code less secure, more prone to scripting attacks. Makes it harder for the virtual machine to optimize the code.
		
### B.10

Do **not** use with{}

- Reason: Promotes ambiguity as to which variable is being read or modified when two variables share the same name, one inside the scope and one outside.

### B.11

Do not use sparse arrays

- Reason: Objects/dictionaries are better suited for storing non-sequential data

### B.12

Do **not** use monkey patches

- Reason: They may have unintended effects on other, unrelated code and are extremely hard to debug.

- See: [Monkey Patch on Wikipedia](http://en.wikipedia.org/wiki/Monkey_patch)




## References

[http://javascript.crockford.com/code.html](http://javascript.crockford.com/code.html)

[http://www.jslint.com/](http://www.jslint.com/)

[http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)

[http://bonsaiden.github.com/JavaScript-Garden/](http://bonsaiden.github.com/JavaScript-Garden/)

		
