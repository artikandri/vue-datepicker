import Vue from "vue";
import "font-awesome/css/font-awesome.min.css";
import "@sass/app.scss";
import "@directives/index.js";
import "@helpers/momentLocale.js";

import Datepicker from "@components/Datepicker.vue";

Vue.component("Datepicker", Datepicker);

export default { title: "Datepicker" };

export const asAComponent = () => ({
	components: { Datepicker },
	data() {
		return {
			date: ""
		};
	},
	template: '<datepicker v-model="date" />'
});
