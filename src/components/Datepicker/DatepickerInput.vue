<template>
	<div class="datepicker-form">
		<input
			type="text"
			class="datepicker-input"
			:placeholder="placeholder"
			:value="date"
			:readonly="trigger"
			:disabled="trigger"
			@blur="toggleDatepickerInputFocus(false)"
			@focus="toggleDatepickerInputFocus(true)"
			@change="setDateValue"
		/>
		<button
			type="button"
			name="datepickerButton"
			:disabled="!trigger"
			class="btn btn-datepicker"
			@click="toggleDatepickerPopoverOnTrigger"
		>
			<i
				class="fa fa-calendar btn-datepicker-icon"
				name="datepickerButtonIcon"
				aria-hidden="true"
			></i>
		</button>
	</div>
</template>
<script>
export default {
	name: "datepickerInput",
	props: {
		placeholder: {
			type: String,
			default() {
				return "Pick a date";
			}
		},
		trigger: {
			type: Boolean,
			default() {
				return false;
			}
		},
		date: {
			type: String,
			default() {
				return "";
			}
		}
	},
	data() {
		return {};
	},
	mounted() {},
	methods: {
		toggleDatepickerInputFocus(focusValue) {
			if (!this.trigger) {
				this.$emit("focus", focusValue);
			}
		},
		toggleDatepickerPopoverOnTrigger() {
			if (this.trigger) {
				this.$emit("click:datepickerinputbutton");
			}
		},
		setDateValue: _.debounce(function($event) {
			let dateValue = $event.target.value;
			if (!this.trigger) {
				this.$emit("update:datepickerinput", dateValue);
			}
		}, 500)
	}
};
</script>
