import Storage from './storage' 
export default {
	collection: [],
	setData(bookmarks, pagination) {
		this.pagination = pagination
		this.collection = bookmarks
		return this
	},
	create(next) {
		this.collection.unshift({ id: Date.now(), label: "", url: "" })
		console.log("Bookmark Collection", this.collection)
		Storage.saveStore(this.collection)
		next(this.collection)
	},
	update(payload, next) {
		let id = asInterger(payload.filter(item => item.key === 'id').pop().value)
		this.collection = this.collection.map(item => {
			return item.id === id ? updateData(item, payload) : item
		})
		Storage.saveStore(this.collection)
		next(this.collection)
	},
	getPaginated() {
		let page = getUrlParams('page')
		let isPaginated = typeof page === "string" 
		return isPaginated ? this.sortBookmarks(asInterger(page)) : this.sortBookmarks()
	},
	sortBookmarks(int = 1) {
		let page = int
		let start = (page - 1) * this.pagination
		let end = start + this.pagination
		let index = start < this.collection.length ? start : 0
		return this.collection.slice(index, end)
	},
	removeItemById(id, next) {
		let index = this.collection.map(item => {
			return Math.abs(item.id)
		}).indexOf(id)
		this.collection.splice(index, 1)
		Storage.saveStore(this.collection)
		next(this.collection)
	}
}
function updateData(current, payload) {
	let update = {}
	payload.forEach(field => {
		update[field.key] = field.key === "id" ? asInterger(field.value) : field.value
	})
	return Object.assign(current, update)
}

function asInterger(string) {
	return Math.abs(string)
}
function getUrlParams(name) {
    var params = {}
    location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
        params[key] = value
    });
    return params[name] || params
}