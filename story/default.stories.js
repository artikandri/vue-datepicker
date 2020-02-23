import Vue from "vue";
import { actions } from "@storybook/addon-actions";
import Datepicker from "@components/Datepicker.vue";
import { introduction } from "~story/assets/datepicker/default.js";

Vue.component("Datepicker", Datepicker);

export default {
	title: "DefaultDatepicker",
	excludeStories: /.*Data$/,
	parameters: {
		notes: { Introduction: introduction }
	}
};

const actionsData = actions({
	onClick: "show"
});

const defaultTemplate = `
	<div
		id="defaultView"
		class="datepicker-documentation datepicker-documentation--default"
	>	
		<div class="datepicker docs datepicker-example">
			<h3 class="text-left">Datepicker</h3>
			<p class="text-left docs__description">
				The <code>datepicker</code> offers the user a visual representation for selecting date/month/year. 
				This datepicker was based on another datepicker <a href="https://fengyuanchen.github.io/datepicker/">by fengyuanchen on Github</a>
			</p>
		</div>
		<br/>
		<div class="datepicker docs datepicker-example">
			<h4>Usage</h4>
			<p>
				The calendar in this <code>datepicker</code> come in two variations, 
				wrapped in popover (default) or as an inline component. 
			</p>

		</div>
		<div class="datepicker docs datepicker-example datepicker--popover">
			<h4 class="text-left docs__title">Default state (Popover mode)</h4>
			<p class="text-left">
				There are two states 
			</p>
			<div class="input-group">
				<datepicker  ref="datepicker" v-model="date"></datepicker>
			</div>
		</div>
		<br />
		<div class="datepicker datepicker-example datepicker--inline">
			<h4 class="text-left">Default state (Inline mode)</h4>
			<div class="input-group">
				<datepicker
					ref="datepicker"
					v-model="date"
					:container="true"
					:inline="true"
				></datepicker>
			</div>
		</div>
	</div>
`;

// default task state
export const DefaultState = () => ({
	components: { Datepicker },
	template: defaultTemplate,
	data() {
		return {
			date: ""
		};
	},
	methods: actionsData
});
