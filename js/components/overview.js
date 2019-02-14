export default {
	mount(override) {
		if(!this.mounted || override) {	
			this.children.newitem = this.el.querySelector('.action-add')
			this.children.bookmarks = this.el.querySelectorAll('.bookmark_item')
			this.children.bookmarks.forEach(el => {
				let edit = el.querySelector('.action-edit')
				let remove = el.querySelector('.action-remove')
				edit.addEventListener('click', e => this.editBookmark(el))
				remove.addEventListener('click', e => this.removeBookmark(el))
			})
			this.children.newitem.addEventListener('click', e => this.createBookmark())			
			this.mounted = true
		}
	},
	editBookmark(el) {
		let id = Math.abs(el.dataset.id)
		let data = this.parent.state.bookmarks.getPaginated().filter(item => item.id === id).pop()

		this.el.classList.add("has-blur")
		this.parent.dom.editor.updateMarkup(data)
		this.parent.updateView('edit')
	},
	removeBookmark(el) {
		let id = Math.abs(el.dataset.id)
		this.parent.state.bookmarks.removeItemById(id , bookmarks => {
			this.updateMarkup(bookmarks)
			this.parent.updateView('remove')
		})
	},
	createBookmark() {
		this.parent.state.bookmarks.create(bookmarks => {
			let paginated = this.parent.state.bookmarks.getPaginated(bookmarks)
			this.updateMarkup(paginated)
			this.parent.updateView('list')	
		})
	},
	updateMarkup(bookmarks) {
		this.markup.partial = bookmarks.map(asBookmarks)
		this.markup.template = getBookmarkContainer(this.markup.partial)
	},
	getTemplate() {
		return this.markup.template
	}
}

function getBookmarkContainer(collection) {
	return `
		<div class="bookmarks_container">
			<div class="collection">
				${collection.join('')}
			</div>
			<div class="action-add">
				<div class="fa--add"></div>
				<span>Add new link</span>
			</div>
		</div>
	`
}
function asBookmarks(item) {
	let active = item.url.length > 0 ? "" : "is-deactivated"
	return `
		<div class="bookmark_item" data-id="${item.id}">
			<div class="action-link ${active}">
				<div class="fa--bm"></div>
				<a href="${item.url}" target="_blank">${item.label}</a>
			</div>
			<div class="action-edit">
				<div class="fa--edit"></div>
				<span>Edit</span>
			</div>
			<div class="action-remove">
				<div class="fa--remove"></div>
				<span>Remove</span>
			</div>
		</div>
	`
}