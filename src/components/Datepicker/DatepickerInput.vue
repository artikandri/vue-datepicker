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
		<small v-show="showWarning" class="text-danger">
			{{ warningText }}
		</small>
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
		return {
			warningText: "",
			showWarning: false
		};
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
		isWithinRange(dateString) {
			let { startDate, endDate, format } = this.datepickerOptions;

			let startTimestamp = startDate
				? parseInt(moment(startDate, format).format("x"))
				: 0;
			let endTimestamp = endDate
				? parseInt(moment(endDate, format).format("x"))
				: 0;
			let dateTimestamp = dateString
				? parseInt(moment(dateString, format).format("x"))
				: 0;

			let isWithinRange = true;
			if (startTimestamp || endTimestamp) {
				if (startTimestamp && endTimestamp) {
					isWithinRange =
						dateTimestamp >= startTimestamp &&
						dateTimestamp <= endTimestamp;
				} else if (startTimestamp && !endTimestamp) {
					isWithinRange = dateTimestamp >= startTimestamp;
				} else if (!startTimestamp && endTimestamp) {
					isWithinRange = dateTimestamp <= endTimestamp;
				} else {
					isWithinRange = false;
				}
			} else {
				isWithinRange = true;
			}

			return isWithinRange;
		},
		setDateValue: _.debounce(function($event) {
			let dateValue = $event.target.value;
			let { startDate, endDate, format } = this.datepickerOptions;
			if (!this.trigger) {
				if (this.checkInputValidity(dateValue)) {
					this.showWarning = false;

					if (this.isWithinRange(dateValue)) {
						this.showWarning = false;

						this.$emit("change:setStep", 2);
						this.$emit("update:datepickerInput", dateValue);
					} else {
						this.showWarning = true;
						this.warningText = `Please enter the date between ${startDate} - ${endDate}`;
					}
				} else {
					this.showWarning = true;
					this.warningText = `Please enter the date in format: ${format}`;
				}
			}
		}, 500)
	}
};
</script>
