# Phantom

### Bookmarks Application

**Brief Overview**

This micro application performs the following features:

* Shows 5 links per page

* Allows user simple CRUD with bookmarks
* Data persists against page reloads
* Pagination
* URL Form field validation
* Response message after submitting the form
* Built in pure JS (ES6 compiled => ES5)
* Single JS bundle
* Basic HTML wrapper

What has been missed from the brief (_due to time constraints_):

* User Flow has been adjusted, whereupon the "results" page has been reduced to just a modal message, upon a successful bookmark creation.
* User validation allows a URL to be created "empty". However the Link itself is deactivated if this is the case.
* I had a look, and it's something I can switch to - but I didn't adhear to Google Style guidelines, however the code is still very much considered and presentable as readable.
* Didn't really get a chance to excel in style delivery!
* My single JS bundle was not processed using the Google Closure Compiler, with advanced optimisations

## App installation

Sorry, but no public deployment has been made.

To test the app - navigate to the repository directory:

```
npm install // load dev dependancies
npm start	// opens a tab at http://localhost:3000/
```

Find the compiled code in the `public` directory.

**Clearup** - open the browser console ..

```
phantom.reset() // clears out the LocalStorage
```

**Technologies used**

* Rollup (module bundler)
* Buble (ES6 transpiler)
* Pug (HTML compiler)
* Stylus (CSS preprocessor)
* NPM Scripts (Build process)



## Architecture overview

_very quickly_

I followed MVC style practice, to deliver the Single Page App.

Entry occurs simply at `js/main` that uses `js/app` , that checks for any LocalStorage history.

The main driver (**Controller**) is the `js/controller` which is responsible for loading in the "components", handling state, and rendering view updates to the DOM. 

I use the following services `js/service/storage`, `js/service/bookmarks` that maintain memory state, the Bookmark **Model**, and handle the LocalStorage.

My Components found in `js/components/*` use template strings to generate HTML markup. Follow the same conventions, and are responsible for DOM side effects, interactions, representing the **View** as seen in many other React | Vue | Web-Component based frameworks. 

**HTML** entry points for the App:

Find this occuring at `pug/partials/spa`, _extending_ `pug/views/index`

```
#root
	overview			// Bookmarks collection
	modal--editor		// Bookmark Form
	modal--response		// Form response
	footer				// Pagination
```

These relate to the following components:

* `js/components/overview` : The main 'overview' page of paginated results
* `js/components/editor` : Bookmark Form handler
* `js/components/response` : A very static response view
* `js/compomnents/footer` : Generates the pagination links

---

### Remarks

Not using a Framework, my efforts went into the structure of the app. Rather than being able to spend that time on styling out interactions and transitions etc.

I am not by all means suggesting this is a Framework! There are Frameworks out there to do such a job. Therefore I am aware of the many bottle necks present, chances of memory leaks etc.

With the time I had, certain things had to be missed out on - such as decent form validation | realisation which would have been things that would have been extracted as entities | modules | classes themselves. The components could be better created - but that would step on the toes of templating engines, view libraries, shadow DOM etc. But inheritence within the Component creation could have been better. 

Again, I was not trying to be a maverick - but general time didn't allow me to switch clothes quick enough to employ your Google standards.

might not have enough code comments - trying to get this to you ASAP

Thanks for your time!