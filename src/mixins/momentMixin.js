const momentMixin = {
	mounted() {
		this.momentMixin__setLocale();
	},
	methods: {
		momentMixin__setLocale() {
			const options = this.datepickerOptions || this.options || {};
			if (options && options.language) {
				let { language } = options;
				moment.locale(language);
			}
		}
	}
};

export default momentMixin;
