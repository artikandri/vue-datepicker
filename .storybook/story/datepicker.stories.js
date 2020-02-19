import Vue from "vue";
import Datepicker from "@components/Datepicker.vue";

export default { title: "Datepicker" };

export const withText = () => "<datepicker>with text</datepicker>";

export const withEmoji = () => "<datepicker>😀 😎 👍 💯</datepicker>";

export const asAComponent = () => ({
	components: { Datepicker },
	template: '< datepicker v-model="09/01/2020" />'
});
