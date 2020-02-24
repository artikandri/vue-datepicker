import Vue from "vue";
import Datepicker from "@components/Datepicker.vue";
import { Meta, Story, Preview } from "@storybook/addon-docs/blocks";

Vue.component("Datepicker", Datepicker);

export default {
	title: "Datepicker",
	excludeStories: /.*Data$/,
	parameters: {
		viewMode: "docs",
		descriptionSlot: `The <code>datepicker</code> offers the user a visual representation for selecting date/month/year.
				This datepicker was based on another datepicker <a href="https://fengyuanchen.github.io/datepicker/">by fengyuanchen on Github</a>.
				The calendar in this datepicker came in two variations, with popover (default) or positioned under the textbox.`
	}
};

// default task state
export const DefaultState = () => ({
	components: { Datepicker },
	template: `
	<div
		id="defaultView"
		class=""
	>
		<div class="datepicker docs datepicker-example datepicker--popover">
			<h4 class="text-left docs__title">Default state (Popover mode)</h4>
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
	`,
	data() {
		return {
			date: ""
		};
	}
});

export const TriggerState = () => ({
	components: { Datepicker },
	template: `
	<div
		id="defaultView"
		class=""
	>
		<div class="datepicker docs datepicker-example">
			<h3 class="text-left">Datepicker</h3>
			<p class="text-left docs__description">
				The <code>datepicker</code> offers the user a visual representation for selecting date/month/year.
				This datepicker was based on another datepicker <a href="https://fengyuanchen.github.io/datepicker/">by fengyuanchen on Github</a>.
				The calendar in this datepicker came in two variations, with popover (default) or positioned under the textbox.
			</p>
		</div>
		<br/>
		<div class="datepicker docs datepicker-example datepicker--popover">
			<h4 class="text-left docs__title">Default state (Popover mode)</h4>
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
	`,
	data() {
		return {
			date: ""
		};
	}
});
