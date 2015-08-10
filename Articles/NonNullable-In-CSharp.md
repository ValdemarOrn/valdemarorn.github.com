<!--
{
    "Id": "NonNullable-in-CSharp",
	"WindowTitle": "",
	"Title": "Non-nullable reference objects in C#",
    "Date": "2013-04-19"
}
-->

Often, it is useful to assert as quickly as possible that the data passed into a function is out of bounds or illegal is some way. Checking for obvious errors early can lead to code that is easier to debug when it eventually break (as all code does).

This is an example of a non-nullable wrapper for C#.

You can think of it like the complete opposite of Nullable&lt;T&gt;:

* Nullable&lt;T&gt; gives you the ability to pass around or store either a value or null.
* Required&lt;T&gt; forces the value to be non-null.

Trying to assign null to a Required&lt;T&gt; variable, or passing null into a method that defines the input as Required&lt;T&gt; will cause an exception. This is good because the sooner we catch errors, the better. Code that fails early is much easier to debug and maintain than code that fails five calls deeper.

## The Code:

	namespace System
	{
	    /// <summary>
	    /// Non-nullable wrapper.
	    /// </summary>
	    /// <typeparam name="T"></typeparam>
	    public struct Required<T>
	    {
	        T _value;
	        public T Value
	        {
	            get { return _value; }
	            private set { _value = value; }
	        }
	
	        public Required(T val)
	        {
	            _value = default(T);
	
	            if (((object)val) != null)
	                Value = val;
	            else
	                throw new ArgumentNullException("Required value cannot be null");
	        }
	
	        public static implicit operator Required<T>(T val)
	        {
	            return new Required<T>(val);
	        }
	
	        public static implicit operator T(Required<T> val)
	        {
	            return val.Value;
	        }
	
	        public static bool operator ==(Required<T> a, Required<T> b)
	        {
	            if (System.Object.ReferenceEquals(a, b))
	                return true;
	
	            return a.Value.Equals(b.Value);
	        }
	
	        public static bool operator !=(Required<T> a, Required<T> b)
	        {
	            return !(a == b);
	        }
	
	        public override bool Equals(object obj)
	        {
	            if (obj == null)
	                return false;
	
	            try
	            {
	                T val = (T)obj;
	                return Value.Equals(val);
	            }
	            catch (Exception)
	            {
	                return false;
	            }
	        }
	
	        public bool Equals(T obj)
	        {
	            // Return true if the fields match:
	            return Value.Equals(obj);
	        }
	
	        public override string ToString()
	        {
	            return _value.ToString();
	        }
	    }
	}

## A Simple test:

	/// Simple example that show how to use Required<T> wrapper.
	
	using System;
	using System.Collections.Generic;
	using System.Linq;
	using System.Text;
	using System.Threading.Tasks;
	
	namespace RequiredTest
	{
	    class Person
	    {
	        public string Name;
	        public override string ToString() { return "Name: " + Name; }
	    }
	
	    class Program
	    {
	        static void Main(string[] args)
	        {
	            var person = new Person();
	            person.Name = "Valdemar";
	            Do(person);
	            Do(null); // throws an exception
	        }
	
	        static void Do(Required<Person> person)
	        {
	            // Convert to Person. Can also use person.Value
	            Console.WriteLine("your name is " + ((Person)person).Name); 
	
	            ChangeName(person); // implicit conversion back to Person
	            Console.WriteLine(person.ToString()); // invokes Person.ToString()
	        }
	
	        static void ChangeName(Person person)
	        {
	            person.Name = "Mister T.";
	        }
	    }
	}