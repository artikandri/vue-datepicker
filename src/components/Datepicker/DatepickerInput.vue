<template>
	<div class="datepicker-form">
		<div class="form-group datepicker-form__form-group">
			<div class="datepicker-form__input-group input-group ">
				<input
					type="text"
					aria-label="date input"
					class="datepicker-form__input datepicker-input "
					placeholder="Pick a date"
					:value="date"
					:readonly="trigger"
					:disabled="trigger"
					@enter="setDateValue"
					@blur="toggleDatepickerInputFocus(false)"
					@focus="toggleDatepickerInputFocus(true)"
					@change="setDateValue"
				/>
				<div class="input-group-append">
					<button
						type="button"
						name="datepickerButton"
						:disabled="!trigger"
						class="btn btn-datepicker btn-light datepicker-form__button"
						@click="toggleDatepickerPopoverOnTrigger"
					>
						<i
							class="fa fa-calendar btn-datepicker__icon"
							name="datepickerButtonIcon"
							aria-hidden="true"
						></i>
					</button>
				</div>
			</div>
		</div>
		<small v-show="showWarning" class="datepicker-form__error  text-danger">
			{{ warningText }}
		</small>
	</div>
</template>
<script>
import timeMixin from "@mixins/timeMixin";
export default {
	name: "DatepickerInput",
	mixins: [timeMixin],
	props: {
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
		/**
		 * @desc check the dateString validity by comparing it with the format
		 * @param String: dateString
		 * @return bool: true or false
		 */
		checkInputValidity(dateString = "") {
			let { format } = this.datepickerOptions;
			return moment(dateString, format, true).isValid();
		},
		/**
		 * @desc toggle the datepicker input focus in parent on input focus/blur
		 * @param bool: focusValue
		 * @return bool: true or false
		 */
		toggleDatepickerInputFocus(focusValue = false) {
			if (!this.trigger) {
				this.$emit("focus", focusValue);
			}
		},
		/**
		 * @desc check the dateString validity by comparing it with the format
		 * @param String: dateString
		 * @return bool: true or false
		 */
		toggleDatepickerPopoverOnTrigger() {
			if (this.trigger) {
				this.$emit("click:datepickerInputButton");
			}
		},
		isWithinRange(dateString) {
			let { startDate, endDate, format } = this.datepickerOptions;
			let isWithinRange = this.timeMixin__canChangeNav(
				{
					startDate,
					endDate,
					dateString
				},
				{ format, newFormat: "x" }
			);

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
						this.warningText = `Please  enter a date between ${startDate} to ${endDate}`;
					}
				} else {
					this.showWarning = true;
					this.warningText = `Please enter the date in ${format} format`;
				}
			}
		}, 500)
	}
};
</script>
