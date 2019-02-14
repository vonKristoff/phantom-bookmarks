import Storage from './service/storage' 
import database from './utils/database'
import Controller from './controller'
export default {
	init() {
		checkDataStore(Storage.hasStore()).loadView((bookmarks) => Controller.make(bookmarks))
	},
	reset() {
		if(Storage.hasStore()) Storage.removeStore()
		console.log("LocalStorage has been cleared :)")
	}
}

function checkDataStore(hasDataAlready) {
	if(!hasDataAlready) Storage.saveStore(database)
	let bookmarks = Storage.getStore()
	function loadView(fn) {
		fn(bookmarks)
	}
	return { loadView }
}
