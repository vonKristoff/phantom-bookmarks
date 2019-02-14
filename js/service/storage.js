// Handles Local Storage Settings
const APP_KEY = "PHANTOM"
const Storage = {
    getStore() {
        return JSON.parse(localStorage.getItem(APP_KEY))
    },
    hasStore() {
        return this.getStore() === null ? false : true
    },
    saveStore(data) {
        console.log("Saving data to localStorage")
        localStorage.setItem(APP_KEY, JSON.stringify(data))
    },
    removeStore() {
        localStorage.removeItem(APP_KEY)
    }
}

export default Storage