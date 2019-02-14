const BASE_URL = "http://localhost:3000"
export default {
	mount() {
		// if(this.pageCount() < 2) this.el.style.display = "none"
	},
	updateMarkup() {
		let pages = this.pageCount()
		let currentPage = typeof getUrlParams('page') === "string" ? Math.abs(getUrlParams('page')) : 1
		this.markup.template = generateLinks(pages, currentPage).join('')
	},
	pageCount() {
		let total = this.parent.state.bookmarks.collection.length
		return Math.ceil(total / this.parent.state.pagination)
	},
	getTemplate() {
		return this.markup.template
	}
}
function generateLinks(count, current) {
	let template = []
	for(let i = 1; i <= count; i++) {
		let active = current === i ? " is-active" : ""
		template.push(`
			<div class="link_wrap${active}">
				<div class="fa--link"></div>
				<a href="${BASE_URL}?page=${i}">${i}</a>
			</div>
		`)
	}
	return template
}
function getUrlParams(name) {
    var params = {}
    location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
        params[key] = value
    });
    return params[name] || params
}