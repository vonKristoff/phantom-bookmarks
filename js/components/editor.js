export default {
	mount(override) {
		if(!this.mounted || override) {
			// selectors	
			let $c = this.children 
			$c.form = this.el.querySelector('.editor_form')
			$c.close = this.el.querySelector('.fa--close')
			$c.validation = this.el.querySelector('.validation--url')
			// add listeners
			$c.close.addEventListener('click', () => this.closeViewTo())
			$c.form.addEventListener('submit', e => this.formSubmit(e))
			this.mounted = true
		}
		// handle classes
		this.handleView()
	},
	handleView() {
		setTimeout(() => {
			this.el.classList.add('is-active')	
		}, 50)
	},
	closeViewTo(view = 'list') {
		this.el.classList.remove('is-active')
		this.parent.updateView(view)
	},
	updateMarkup(data) {
		this.markup.template = getEditorMarkup(data)
	},
	getTemplate() {
		return this.markup.template
	},
	formSubmit(e) {
		e.preventDefault()
		let fields = this.children.form.querySelectorAll('.is-model')
		let payload = []
		// grab value from input fields
		fields.forEach(el => {
			payload.push({ key: el.name, value: el.value })
		})
		if(this.children.validation.classList.contains('has-error')) this.children.validation.classList.remove('has-error')
		this.validateFields(payload).then(() => {
			this.parent.state.bookmarks.update(payload, collection => {
				this.parent.dom.overview.updateMarkup(collection)
				this.closeViewTo('response')
			})
		}).catch(error => this.handleError(error))
	},
	validateFields(payload) {
		return new Promise((resolve, reject) => {
			let URLField = payload.filter(item => item.key === "url").pop()
			let valid = URLField.value != "" ? URLValidator(URLField.value) : true
			if(valid) resolve()
			else reject({ type: 'validation', code: 500, message: "not a valid url" })
		})
	},
	handleError(error) {
		// not using error object because im cheating
		// would build a seperate error service to handle this better
		console.log(error)
		this.children.validation.classList.add('has-error')
	}
}

function getEditorMarkup(currentData) {
	let data = currentData ? currentData : ""
	return `
		<div class="content is-card">
			<div class="head">
				<div class="fa--close"></div>
			</div>
			<div class="body">
				<form class="editor_form">
					<input type="hidden" value="${data.id}" name="id" class="is-model"/>
					<div class="field">
						<div class="fa--pen"></div>
						<label>Label</label>
						<input type="text" value="${data.label}" name="label" class="is-model"/>
					</div>
					<div class="field validation--url">
						<div class="fa--url"></div>
						<label>URL</label>
						<input type="text" value="${data.url}" placeholder="https://sample.com" name="url" class="is-model"/>
					</div>
					<button type="submit" class="editor_submit">Submit</button>
				</form>
			</div>
		</div>
	`
}

function URLValidator(url) {
	let exp = "^(https?://)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$"
    let res = new RegExp(exp,"i")
    return res.test(url)
}