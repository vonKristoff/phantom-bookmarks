import Storage from './service/storage' 
import database from './utils/database'
import Controller from './controller'
export default {
	init() {
		// boot app | check whether theres already data | or run for the first time
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
