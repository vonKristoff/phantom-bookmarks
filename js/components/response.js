export default {
	mount(override) {
		if(!this.mounted || override) {
			this.children.close = this.el.querySelector('.fa--close')
			this.children.close.addEventListener('click', () => this.closeViewTo())
			this.mounted = true
		}
		this.handleView()
	},
	handleView() {
		this.el.classList.add('is-active')
	},
	closeViewTo(view = 'list') {
		this.el.classList.remove('is-active')
		this.parent.updateView(view)
	}
}