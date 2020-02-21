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
		},
		datepickerOptions: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {};
	},
	mounted() {},
	methods: {
		checkInputValidity(dateString) {
			let { format } = this.datepickerOptions;
			return moment(dateString, format, true).isValid();
		},
		toggleDatepickerInputFocus(focusValue) {
			if (!this.trigger) {
				this.$emit("focus", focusValue);
			}
		},
		toggleDatepickerPopoverOnTrigger() {
			if (this.trigger) {
				this.$emit("click:datepickerInputButton");
			}
		},
		setDateValue: _.debounce(function($event) {
			let dateValue = $event.target.value;
			if (!this.trigger) {
				if (this.checkInputValidity(dateValue)) {
					this.$emit("change:setStep", 2);
					this.$emit("update:datepickerInput", dateValue);
				}
			}
		}, 500)
	}
};
</script>
