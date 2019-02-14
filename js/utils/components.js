import overview from '../components/overview'
import editor from '../components/editor'
import response from '../components/response'
import footer from '../components/footer'
const methods = {
	overview,
	editor,
	response,
	footer
}
// mini factory to help generate components
export default {
	make(obj) {
		let name = Object.keys(obj).pop()
		let el = obj[name]
		return Object.assign(methods[name], { name, parent: this, el, children: {}, markup: {}, mounted: false })
	}
}