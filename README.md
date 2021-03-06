EdisonJS
=========

Most JavaScript routing libraries provide little to no guidance in terms of how one might best go about organizing complex single-page applications with many routes. EdisonJS seeks to simplify the organizational structure of complex single-page applications by encouraging developers to organize their applications as a series of parent ("section") <-> child ("route") relationships. The result is a simple, clean, and powerful organizational structure.


* [Using EdisonJS](#using-edisonjs)
	* [Creating a New Instance of EdisonJS](#creating-instance)	
	* [Creating a Section](#creating-section)
	* [Creating a Route](#creating-route)
	* [Passing Parameters](#passing-parameters)
	* [Extending Sections](#extending-sections)
	* [Extending Routes](#extending-routes)
	* [Accessing Parent Sections from Routes](#accessing-parents)
	* [Global Section and Route Extensions](#global-extensions)
	* [Cleanup Routines (Optional)](#cleanup-routines)
	* [Global Cleanup Extensions](#global-cleanup-extensions)
	* [One More Thing](#one-more-thing)
* [Installation](#installation)
	* [Bower](#bower)
* [Configuration](#configuration)
* [License (MIT)](#license)

<a name="using-edisonjs"></a>
## Using EdisonJS

<a name="creating-instance"></a>
### Creating a New Instance of EdisonJS

In this example, we create a new instance of EdisonJS and pass a single option - `container`. Each route that we define will have a template associated with it, and this option determines where those templates are inserted into our document.

```javascript
var edison = new Edison({
	'container': 'route_container'
});
```

<a name="creating-section"></a>
### Creating a Section

A typical web application is comprised of many different "routes." EdisonJS encourages the developer to group related routes under a parent "section" as shown below:

```javascript
var users = edison.createSection({
	'name': 'users', // Determines our URL structure
	'callback': function() {
		console.log("Welcome to the 'users' section.");
	}
});
```

When a user navigates to a route belonging to the "users" section for the first time, the section's callback function will be fired. As the user navigates between routes within the section, this callback function does not continue to fire. As a result, this callback function is useful for performing setup routines that related routes would typically have to perform on their own.

<a name="creating-route"></a>
### Creating a Route

```javascript
users.createRoute({
	'name': 'list', // Determines our URL structure
	'template': template, // A string containing this route's template
	'callback': function() {
		console.log("Welcome to the 'users/list' route.");
	}
});
```

With our first section and route defined, we can now navigate to the following URL:

```html
http://site.com/#users/list
```

In your console, you should now see the following messages:

```javascript
Welcome to the 'users' section.
Welcome to the 'users/list' route.
```

<a name="passing-parameters"></a>
### Passing Parameters

Routes can accept a single `id` parameter as shown below:

```javascript
// URL: http://site.com/#users/list/5

users.createRoute({
	'name': 'list',
	'template': template,
	'callback': function(id) {
		// id === 5
	}
});
```

For greater flexibility, you can also access query parameters directly, as shown below:

```javascript
// URL: http://site.com/#users/list?name=Joe

users.createRoute({
	'name': 'list',
	'template': template,
	'callback': function() {
		var name = this.get('name'); // name === 'Joe'
	}
});
```

<a name="extending-sections"></a>
### Extending Sections

Sections can extend their functionality as shown below. As a result, sections can remain organized as they inevitably grow more complex:

```javascript
var users = edison.createSection({
	'name': 'users',
	'callback': function() {
		this.doSomething();
	},
	'extend': {
		'doSomething': function() {
			console.log("The 'users' section is doing something.");
		}
	}
});
```

<a name="extending-routes"></a>
### Extending Routes

In a similar manner, routes can also extend their functionality.

```javascript
users.createRoute({
	'name': 'list',
	'template': template,
	'callback': function() {
		this.list();
	},
	'extend': {
		'list': function() {
			console.log('I am listing.');
		}
	}
});
```

<a name="accessing-parents"></a>
### Accessing Parent Sections from Routes

A route can access its parent section as shown below:

```javascript
var users = edison.createSection({
	'name': 'users',
	'callback': function() {
		this.day = 'Tuesday';
	},
	'extend': {
		'growl': function() {
			console.log("The 'users' section is growling.");
		}
	}
});

users.createRoute({
	'name': 'list',
	'template': template,
	'callback': function() {
		var day = this.section.day;
		this.section.growl();
	}
});
```

<a name="global-extensions"></a>
### Global Section and Route Extensions

Functionality shared across all sections and routes throughout the application can be extended globally as shown below:

```javascript
edison.extend({
	'request': function() {
		/* All sections and routes can now call: this.request(); */
	}
});
```

<a name="cleanup-routines"></a>
### Cleanup Routines (Optional)

If a section or route is given a `cleanup` method, it will be called when the user navigates to a different section or route. See below:

```javascript
var users = edison.createSection({
	'name': 'users',
	'callback': function() {
	},
	'cleanup': function() {
		// Called when the user leaves this section.
	}
});

users.createRoute({
	'name': 'list',
	'template': template,
	'callback': function() {
	},
	'cleanup': function() {
		// Called when the user leaves this route.
	}
});
```

<a name="global-cleanup-extensions"></a>
### Global Cleanup Extensions

In the following example, we pass a callback function to the `extendCleanup` method. By doing so, we instruct EdisonJS to run the callback each time the user navigates away from any section or route - in addition to any `cleanup` methods that are defined on a specific section or route.

```javascript
edison.extendCleanup(function() {
	/* Called every time the user leaves a section or route. */
});
```

<a name="one-more-thing"></a>
### One More Thing

Once all of your sections and routes have been defined, you should call the following method:

```javascript
edison.initRoutes();
```

<a name="installation"></a>
## Installation

<a name="bower"></a>
### Bower

```
$ bower install edisonjs
```

<a name="configuration"></a>
## Configuration

Add the following options to your RequireJS configuration (adjust `location` as appropriate):

```javascript
'packages': [
	{
		'name': 'edison',
		'location': '/edison/dist/',
		'main': 'edison'
	}
]
```

<a name="license"></a>
## License (MIT)

```
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```