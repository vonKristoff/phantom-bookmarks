import BookmarkService from './service/bookmarks'
import Component from './utils/components'
export default {
	make(options) {
		return new Controller(options)
	}
}
class Controller {
	constructor(collection, pagination = 5) {

		const overview = document.querySelector('.overview_container')
		const editor = document.querySelector('.modal--editor')
		const response = document.querySelector('.modal--response')
		const footer = document.querySelector('.page_links')
	
		this.state = { 			
			bookmarks: BookmarkService.setData(collection, pagination), 	// bookmark store
			pagination, 													// items per page view
			mode: "list"													// render schedule
		}
		this.dom = {
			overview: Component.make.call(this, { overview }),
			editor: Component.make.call(this, { editor }),
			response: Component.make.call(this, { response }),
			footer: Component.make.call(this, { footer })
		}		
		this.dom.overview.updateMarkup(this.state.bookmarks.getPaginated())
		this.dom.footer.updateMarkup()
		this.render()
	}
	updateView(mode) {
		this.state.mode = mode
		this.dom.footer.updateMarkup()
		this.render()
	}
	render() {
		let $dom = this.dom
		switch(this.state.mode) {			
			case 'response':
				// not using dynamic markup
				$dom.response.mount()
				break
			case 'edit':
				$dom.editor.el.innerHTML = $dom.editor.getTemplate()
				if($dom.editor.el.innerHTML.length != $dom.editor.getTemplate().length) $dom.editor.mount(true)
				else $dom.editor.handleView()
				break
			case 'remove':
				$dom.overview.el.innerHTML = $dom.overview.getTemplate()
				$dom.footer.el.innerHTML = $dom.footer.getTemplate()
				$dom.overview.mount(true)
				break
			default:				
				if($dom.overview.el.classList.contains("has-blur")) $dom.overview.el.classList.remove("has-blur")
				$dom.overview.el.innerHTML = $dom.overview.getTemplate()
				$dom.overview.mount(true)
				$dom.footer.el.innerHTML = $dom.footer.getTemplate()
		}
	}
}
