<template>
	<fieldset class="datepicker-form">
		<label>
			Datepicker
		</label>
		<input
			type="text"
			:placeholder="placeholder"
			:value="date"
			@blur="toggleDatepickerInputFocus(false)"
			@focus="toggleDatepickerInputFocus(true)"
			@change="setDateValue"
		/>
		<button
			type="button"
			name="datepickerButton"
			class="btn btn-datepicker"
			@click="toggleDatepickerPopover"
		>
			<i class="la la-calendar" aria-hidden="true"></i>
		</button>
	</fieldset>
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
	methods: {
		toggleDatepickerInputFocus(focusValue) {
			this.$emit("focus", focusValue);
		},
		toggleDatepickerPopover() {
			this.$emit("click:datepickerinputbutton");
		},
		setDateValue: _.debounce(function($event) {
			let dateValue = $event.target.value;
			this.$emit("update:datepickerinput", dateValue);
		}, 500)
	}
};
</script>
