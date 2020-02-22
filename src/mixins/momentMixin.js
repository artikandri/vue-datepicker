const momentMixin = {
	mounted() {
		this.momentMixin__setLocale();
	},
	methods: {
		/**
		 * @desc get the language from datepickerOptions and 
		 		set the moment library locale 
		 * @param none
		 * @return none
		 */
		momentMixin__setLocale() {
			const options = this.datepickerOptions || this.options || {};
			if (options && options.language) {
				let { language } = options;
				moment.locale(language || "en");
			}
		}
	}
};

export default momentMixin;
