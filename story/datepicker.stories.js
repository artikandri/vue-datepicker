import Vue from "vue";
import Datepicker from "@components/Datepicker.vue";

let todayDate = Date.now("");

Vue.component("datepicker", Datepicker);

export default { title: "Datepicker" };

export const defaultInstallation = () =>
	`<datepicker v-model="${todayDate}"></datepicker>`;

export const asAComponent = () => ({
	components: { Datepicker },
	template: '<datepicker v-model="09/01/2020" />'
});
