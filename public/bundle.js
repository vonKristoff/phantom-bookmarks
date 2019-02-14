(function () {
    'use strict';

    var APP_KEY = "PHANTOM";
    var Storage = {
        getStore: function getStore() {
            return JSON.parse(localStorage.getItem(APP_KEY))
        },
        hasStore: function hasStore() {
            return this.getStore() === null ? false : true
        },
        saveStore: function saveStore(data) {
            console.log("Saving data to localStorage");
            localStorage.setItem(APP_KEY, JSON.stringify(data));
        },
        removeStore: function removeStore() {
            localStorage.removeItem(APP_KEY);
        }
    };

    // first run bookmarks database
    var database = [
    	{
    		id: 0,
    		label: "Blog of Cats",
    		url: "",
    		tags: []
    	},{
    		id: 1,
    		label: "Blog of Dogs",
    		url: "",
    		tags: []
    	},{
    		id: 2,
    		label: "Blog of Witches",
    		url: "",
    		tags: []
    	}
    ];

    var BookmarkService = {
    	collection: [],
    	setData: function setData(bookmarks, pagination) {
    		this.pagination = pagination;
    		this.collection = bookmarks;
    		return this
    	},
    	create: function create(next) {
    		this.collection.unshift({ id: Date.now(), label: "", url: "" });
    		console.log("Bookmark Collection", this.collection);
    		Storage.saveStore(this.collection);
    		next(this.collection);
    	},
    	update: function update(payload, next) {
    		var id = asInterger(payload.filter(function (item) { return item.key === 'id'; }).pop().value);
    		this.collection = this.collection.map(function (item) {
    			return item.id === id ? updateData(item, payload) : item
    		});
    		Storage.saveStore(this.collection);
    		next(this.collection);
    	},
    	getPaginated: function getPaginated() {
    		var page = getUrlParams('page');
    		var isPaginated = typeof page === "string"; 
    		return isPaginated ? this.sortBookmarks(asInterger(page)) : this.sortBookmarks()
    	},
    	sortBookmarks: function sortBookmarks(int) {
    		if ( int === void 0 ) int = 1;

    		var page = int;
    		var start = (page - 1) * this.pagination;
    		var end = start + this.pagination;
    		var index = start < this.collection.length ? start : 0;
    		return this.collection.slice(index, end)
    	},
    	removeItemById: function removeItemById(id, next) {
    		var index = this.collection.map(function (item) {
    			return Math.abs(item.id)
    		}).indexOf(id);
    		this.collection.splice(index, 1);
    		Storage.saveStore(this.collection);
    		next(this.collection);
    	}
    };
    function updateData(current, payload) {
    	var update = {};
    	payload.forEach(function (field) {
    		update[field.key] = field.key === "id" ? asInterger(field.value) : field.value;
    	});
    	return Object.assign(current, update)
    }

    function asInterger(string) {
    	return Math.abs(string)
    }
    function getUrlParams(name) {
        var params = {};
        location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
            params[key] = value;
        });
        return params[name] || params
    }

    var overview = {
    	mount: function mount(override) {
    		var this$1 = this;

    		if(!this.mounted || override) {	
    			this.children.newitem = this.el.querySelector('.action-add');
    			this.children.bookmarks = this.el.querySelectorAll('.bookmark_item');
    			this.children.bookmarks.forEach(function (el) {
    				var edit = el.querySelector('.action-edit');
    				var remove = el.querySelector('.action-remove');
    				edit.addEventListener('click', function (e) { return this$1.editBookmark(el); });
    				remove.addEventListener('click', function (e) { return this$1.removeBookmark(el); });
    			});
    			this.children.newitem.addEventListener('click', function (e) { return this$1.createBookmark(); });			
    			this.mounted = true;
    		}
    	},
    	editBookmark: function editBookmark(el) {
    		var id = Math.abs(el.dataset.id);
    		var data = this.parent.state.bookmarks.getPaginated().filter(function (item) { return item.id === id; }).pop();

    		this.el.classList.add("has-blur");
    		this.parent.dom.editor.updateMarkup(data);
    		this.parent.updateView('edit');
    	},
    	removeBookmark: function removeBookmark(el) {
    		var this$1 = this;

    		var id = Math.abs(el.dataset.id);
    		this.parent.state.bookmarks.removeItemById(id , function (bookmarks) {
    			this$1.updateMarkup(bookmarks);
    			this$1.parent.updateView('remove');
    		});
    	},
    	createBookmark: function createBookmark() {
    		var this$1 = this;

    		this.parent.state.bookmarks.create(function (bookmarks) {
    			var paginated = this$1.parent.state.bookmarks.getPaginated(bookmarks);
    			this$1.updateMarkup(paginated);
    			this$1.parent.updateView('list');	
    		});
    	},
    	updateMarkup: function updateMarkup(bookmarks) {
    		this.markup.partial = bookmarks.map(asBookmarks);
    		this.markup.template = getBookmarkContainer(this.markup.partial);
    	},
    	getTemplate: function getTemplate() {
    		return this.markup.template
    	}
    };

    function getBookmarkContainer(collection) {
    	return ("\n\t\t<div class=\"bookmarks_container\">\n\t\t\t<div class=\"collection\">\n\t\t\t\t" + (collection.join('')) + "\n\t\t\t</div>\n\t\t\t<div class=\"action-add\">\n\t\t\t\t<div class=\"fa--add\"></div>\n\t\t\t\t<span>Add new link</span>\n\t\t\t</div>\n\t\t</div>\n\t")
    }
    function asBookmarks(item) {
    	var active = item.url.length > 0 ? "" : "is-deactivated";
    	return ("\n\t\t<div class=\"bookmark_item\" data-id=\"" + (item.id) + "\">\n\t\t\t<div class=\"action-link " + active + "\">\n\t\t\t\t<div class=\"fa--bm\"></div>\n\t\t\t\t<a href=\"" + (item.url) + "\" target=\"_blank\">" + (item.label) + "</a>\n\t\t\t</div>\n\t\t\t<div class=\"action-edit\">\n\t\t\t\t<div class=\"fa--edit\"></div>\n\t\t\t\t<span>Edit</span>\n\t\t\t</div>\n\t\t\t<div class=\"action-remove\">\n\t\t\t\t<div class=\"fa--remove\"></div>\n\t\t\t\t<span>Remove</span>\n\t\t\t</div>\n\t\t</div>\n\t")
    }

    var editor = {
    	mount: function mount(override) {
    		var this$1 = this;

    		if(!this.mounted || override) {			
    			var $c = this.children; 
    			$c.form = this.el.querySelector('.editor_form');
    			$c.close = this.el.querySelector('.fa--close');
    			$c.validation = this.el.querySelector('.validation--url');
    			// add listeners
    			$c.close.addEventListener('click', function () { return this$1.closeViewTo(); });
    			$c.form.addEventListener('submit', function (e) { return this$1.formSubmit(e); });
    			this.mounted = true;
    		}
    		// handle classes
    		this.handleView();
    	},
    	handleView: function handleView() {
    		var this$1 = this;

    		setTimeout(function () {
    			this$1.el.classList.add('is-active');	
    		}, 50);
    	},
    	closeViewTo: function closeViewTo(view) {
    		if ( view === void 0 ) view = 'list';

    		this.el.classList.remove('is-active');
    		this.parent.updateView(view);
    	},
    	updateMarkup: function updateMarkup(data) {
    		this.markup.template = getEditorMarkup(data);
    	},
    	getTemplate: function getTemplate() {
    		return this.markup.template
    	},
    	formSubmit: function formSubmit(e) {
    		var this$1 = this;

    		e.preventDefault();
    		var fields = this.children.form.querySelectorAll('.is-model');
    		var payload = [];
    		fields.forEach(function (el) {
    			payload.push({ key: el.name, value: el.value });
    		});
    		if(this.children.validation.classList.contains('has-error')) { this.children.validation.classList.remove('has-error'); }
    		this.validateFields(payload).then(function () {
    			this$1.parent.state.bookmarks.update(payload, function (collection) {
    				this$1.parent.dom.overview.updateMarkup(collection);
    				this$1.closeViewTo('response');
    			});
    		}).catch(function (error) { return this$1.handleError(error); });
    	},
    	validateFields: function validateFields(payload) {
    		return new Promise(function (resolve, reject) {
    			var URLField = payload.filter(function (item) { return item.key === "url"; }).pop();
    			var valid = URLField.value != "" ? URLValidator(URLField.value) : true;
    			if(valid) { resolve(); }
    			else { reject({ type: 'validation', code: 500, message: "not a valid url" }); }
    		})
    	},
    	handleError: function handleError(error) {
    		// not using error object because im cheating
    		// would build a seperate error service to handle this better
    		console.log(error);
    		this.children.validation.classList.add('has-error');
    	}
    };

    function getEditorMarkup(currentData) {
    	var data = currentData ? currentData : "";
    	return ("\n\t\t<div class=\"content is-card\">\n\t\t\t<div class=\"head\">\n\t\t\t\t<div class=\"fa--close\"></div>\n\t\t\t</div>\n\t\t\t<div class=\"body\">\n\t\t\t\t<form class=\"editor_form\">\n\t\t\t\t\t<input type=\"hidden\" value=\"" + (data.id) + "\" name=\"id\" class=\"is-model\"/>\n\t\t\t\t\t<div class=\"field\">\n\t\t\t\t\t\t<div class=\"fa--pen\"></div>\n\t\t\t\t\t\t<label>Label</label>\n\t\t\t\t\t\t<input type=\"text\" value=\"" + (data.label) + "\" name=\"label\" class=\"is-model\"/>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"field validation--url\">\n\t\t\t\t\t\t<div class=\"fa--url\"></div>\n\t\t\t\t\t\t<label>URL</label>\n\t\t\t\t\t\t<input type=\"text\" value=\"" + (data.url) + "\" placeholder=\"https://sample.com\" name=\"url\" class=\"is-model\"/>\n\t\t\t\t\t</div>\n\t\t\t\t\t<button type=\"submit\" class=\"editor_submit\">Submit</button>\n\t\t\t\t</form>\n\t\t\t</div>\n\t\t</div>\n\t")
    }

    function URLValidator(url) {
    	var exp = "^(https?://)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$";
        var res = new RegExp(exp,"i");
        return res.test(url)
    }

    var response = {
    	mount: function mount(override) {
    		var this$1 = this;

    		if(!this.mounted || override) {
    			this.children.close = this.el.querySelector('.fa--close');
    			this.children.close.addEventListener('click', function () { return this$1.closeViewTo(); });
    			this.mounted = true;
    		}
    		this.handleView();
    	},
    	handleView: function handleView() {
    		this.el.classList.add('is-active');
    	},
    	closeViewTo: function closeViewTo(view) {
    		if ( view === void 0 ) view = 'list';

    		this.el.classList.remove('is-active');
    		this.parent.updateView(view);
    	}
    };

    var BASE_URL = "http://localhost:3000";
    var footer = {
    	mount: function mount() {
    		// if(this.pageCount() < 2) this.el.style.display = "none"
    	},
    	updateMarkup: function updateMarkup() {
    		var pages = this.pageCount();
    		var currentPage = typeof getUrlParams$1('page') === "string" ? Math.abs(getUrlParams$1('page')) : 1;
    		this.markup.template = generateLinks(pages, currentPage).join('');
    	},
    	pageCount: function pageCount() {
    		var total = this.parent.state.bookmarks.collection.length;
    		return Math.ceil(total / this.parent.state.pagination)
    	},
    	getTemplate: function getTemplate() {
    		return this.markup.template
    	}
    };
    function generateLinks(count, current) {
    	var template = [];
    	for(var i = 1; i <= count; i++) {
    		var active = current === i ? " is-active" : "";
    		template.push(("\n\t\t\t<div class=\"link_wrap" + active + "\">\n\t\t\t\t<div class=\"fa--link\"></div>\n\t\t\t\t<a href=\"" + BASE_URL + "?page=" + i + "\">" + i + "</a>\n\t\t\t</div>\n\t\t"));
    	}
    	return template
    }
    function getUrlParams$1(name) {
        var params = {};
        location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
            params[key] = value;
        });
        return params[name] || params
    }

    var methods = {
    	overview: overview,
    	editor: editor,
    	response: response,
    	footer: footer
    };
    var Component = {
    	make: function make(obj) {
    		var name = Object.keys(obj).pop();
    		var el = obj[name];
    		return Object.assign(methods[name], { name: name, parent: this, el: el, children: {}, markup: {}, mounted: false })
    	}
    };

    var Controller = {
    	make: function make(options) {
    		return new Controller$1(options)
    	}
    };
    var Controller$1 = function Controller(collection, pagination) {
    	if ( pagination === void 0 ) pagination = 5;


    	var overview = document.querySelector('.overview_container');
    	var editor = document.querySelector('.modal--editor');
    	var response = document.querySelector('.modal--response');
    	var footer = document.querySelector('.page_links');
    	
    	this.state = { 			
    		bookmarks: BookmarkService.setData(collection, pagination), // bookmark store
    		pagination: pagination, 												// items per page view
    		mode: "list"												// render schedule
    	};
    	this.dom = {
    		overview: Component.make.call(this, { overview: overview }),
    		editor: Component.make.call(this, { editor: editor }),
    		response: Component.make.call(this, { response: response }),
    		footer: Component.make.call(this, { footer: footer })
    	};		
    	this.dom.overview.updateMarkup(this.state.bookmarks.getPaginated());
    	this.dom.footer.updateMarkup();
    	this.render();
    };
    Controller$1.prototype.updateView = function updateView (mode) {
    	this.state.mode = mode;
    	this.dom.footer.updateMarkup();
    	this.render();
    };
    Controller$1.prototype.render = function render () {
    	var $dom = this.dom;
    	switch(this.state.mode) {			
    		case 'response':
    			// not using dynamic markup
    			$dom.response.mount();
    			break
    		case 'edit':
    			$dom.editor.el.innerHTML = $dom.editor.getTemplate();
    			if($dom.editor.el.innerHTML.length != $dom.editor.getTemplate().length) { $dom.editor.mount(true); }
    			else { $dom.editor.handleView(); }
    			break
    		case 'remove':
    			$dom.overview.el.innerHTML = $dom.overview.getTemplate();
    			$dom.footer.el.innerHTML = $dom.footer.getTemplate();
    			$dom.overview.mount(true);
    			break
    		default:				
    			if($dom.overview.el.classList.contains("has-blur")) { $dom.overview.el.classList.remove("has-blur"); }
    			$dom.overview.el.innerHTML = $dom.overview.getTemplate();
    			$dom.overview.mount(true);
    			$dom.footer.el.innerHTML = $dom.footer.getTemplate();
    	}
    };

    var App = {
    	init: function init() {
    		checkDataStore(Storage.hasStore()).loadView(function (bookmarks) { return Controller.make(bookmarks); });
    	},
    	reset: function reset() {
    		if(Storage.hasStore()) { Storage.removeStore(); }
    	}
    };

    function checkDataStore(hasDataAlready) {
    	if(!hasDataAlready) { Storage.saveStore(database); }
    	var bookmarks = Storage.getStore();
    	function loadView(fn) {
    		fn(bookmarks);
    	}
    	return { loadView: loadView }
    }

    window.phantom = App.init();

}());
//# sourceMappingURL=bundle.js.map
