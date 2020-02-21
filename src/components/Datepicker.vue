<template>
	<div class="datepicker-wrapper">
		<!--start of datepicker input-->
		<datepicker-input
			:value="value"
			:date="datepickerOptions.date"
			:trigger="trigger"
			:auto-pick="autoPick"
			:datepicker-options="datepickerOptions"
			@click:datepickerInputButton="togglePopoverOnTrigger"
			@change:setStep="setCalendarStep"
			@update:datepickerInput="updateDatepickerInput"
			@focus="toggleInputFocus"
		></datepicker-input>
		<!--end of datepicker input-->

		<!--start of datepicker popover-->
		<datepicker-popover
			style="background: red;"
			@mouseover.native="isPopoverHovered = true"
			v-click-outside.native="turnOffPopoverHover"
			v-show="showPopover"
		>
			<datepicker-calendar
				ref="datepickerCalendar"
				:value="value"
				@click:date-item="hidePopover"
				@input:date="setDateValue"
				:datepicker-options="datepickerOptions"
				:year-first="yearFirst"
				:auto-hide="autoHide"
			></datepicker-calendar>
		</datepicker-popover>
		<!--end of datepicker popover-->

		<!--start of datepicker container-->
		<datepicker-container v-show="isContainerShown">
			<datepicker-calendar
				ref="datepickerCalendar"
				:value="value"
				@click:date-item="hidePopover"
				@input:date="setDateValue"
				:datepicker-options="datepickerOptions"
				:year-first="yearFirst"
				:auto-hide="autoHide"
			></datepicker-calendar>
		</datepicker-container>
		<!--end of datepicker container-->
	</div>
</template>

<script>
// import momentMixin from "@mixins/momentMixin.js";
import DatepickerInput from "@components/Datepicker/DatepickerInput.vue";
import DatepickerPopover from "@components/Datepicker/DatepickerPopover.vue";
import DatepickerCalendar from "@components/Datepicker/DatepickerCalendar.vue";
import DatepickerContainer from "@components/Datepicker/DatepickerContainer.vue";

export default {
	name: "Datepicker",
	// mixins: [momentMixin],
	props: {
		value: {
			type: String,
			default() {
				return "";
			}
		},
		options: {
			/*
				Default options: {
					date: null,
					format: "DD/MM/YYYY",
					startDate: null,
					endDate: null,
					language: "en",
					startView: 0,
					weekStart: 0,
					offset: 0,
					zIndex: 1000
				}
			*/
			type: Object,
			default() {
				return {};
			}
		},
		container: {
			/*
				When activated, append a container under the datepicker input to contain the calendar. Only works when the inline option were set as TRUE; otherwise the container will be empty
			*/
			type: Boolean,
			default() {
				return false;
			}
		},
		trigger: {
			/*
				Changes the input behavior. When activated, the calendar will only appear when the user clicked on the "calendar" icon; instead of the textbox.
			*/
			type: Boolean,
			default() {
				return false;
			}
		},
		inline: {
			/*
				Append the calendar directly under the input instead of popping up on click.
				Only works when the container option were set as TRUE; otherwise the calendar will not show up
			*/
			type: Boolean,
			default() {
				return false;
			}
		},
		autoShow: {
			/*
				Shows the calendar popup on first load.
				Doesnt have any effect in inline view.
			*/
			type: Boolean,
			default() {
				return false;
			}
		},
		autoHide: {
			/*
				Automatically hides the calendar popup after selecting the date.
				Doesnt have any effect in inline view.
			*/
			type: Boolean,
			default() {
				return false;
			}
		},
		autoPick: {
			/*
				Automatically set today date as default date. Only works on the first run.
			*/
			type: Boolean,
			default() {
				return false;
			}
		},
		yearFirst: {
			/*
				Show the year before the month's name in the calendar month view's title
			*/
			type: Boolean,
			default() {
				return false;
			}
		}
	},
	components: {
		DatepickerInput,
		DatepickerPopover,
		DatepickerCalendar,
		DatepickerContainer
	},
	data() {
		return {
			isFocused: this.autoShow === true,
			isPopoverShownOnClick: false,
			isPopoverHovered: false
		};
	},
	mounted() {
		this.setDatepickerLocale();
	},
	computed: {
		showPopover() {
			return (
				(this.isPopoverShown || this.isPopoverShownOnClick) &&
				!this.isContainerShown
			);
		},
		/*
			Shows/hides the container based on the inline and the container value.
			Returns Boolean.
		*/
		isContainerShown() {
			let isContainerShown = this.inline && this.container;
			return isContainerShown;
		},
		/*
			Shows/hides the popover based on the inline and the container value.
			Returns Boolean.
		*/
		isPopoverShown() {
			let isPopoverShown = this.inline === true;
			isPopoverShown = this.isFocused ? true : isPopoverShown;

			return isPopoverShown || this.isPopoverHovered;
		},
		/*
			Returns datepicker options based on the .
			Returns Object.
		*/
		datepickerOptions() {
			const { startDate, endDate, format } = this.options;
			const defaultDateFormat = format || "DD/MM/YYYY";

			const todayDate = moment().format(defaultDateFormat);
			const autoPickDate = this.autoPick ? todayDate : null;
			const dateValue = this.value || autoPickDate || null;

			// check startDate and endDate validity
			let isStartDateValid = startDate
				? moment(startDate, format).isSameOrBefore(
						moment(this.value, format)
				  )
				: true;
			let isEndDateValid = endDate
				? moment(endDate, format).isSameOrAfter(
						moment(this.value, format)
				  )
				: true;

			if (isStartDateValid && startDate) {
				isEndDateValid = endDate
					? moment(endDate, format).isSameOrAfter(
							moment(startDate, format)
					  )
					: isEndDateValid;
			}

			if (isEndDateValid && endDate) {
				isStartDateValid = startDate
					? moment(startDate, format).isSameOrBefore(
							moment(endDate, format)
					  )
					: isStartDateValid;
			}

			// default options
			const defaultOptions = {
				date: dateValue,
				format: "DD/MM/YYYY",
				startDate: "",
				endDate: "",
				language: "en",
				startView: 0,
				weekStart: 0,
				offset: 0,
				zIndex: 1000
			};

			let options = this.options;

			// reset startDate and EndDate when not valid
			// options.startDate = isStartDateValid ? startDate : "";
			// options.endDate = isEndDateValid ? endDate : "";

			const finalOptions = { ...defaultOptions, ...options };

			return finalOptions;
		}
	},
	methods: {
		setDatepickerLocale(options = null) {
			let { language, format } = options || this.datepickerOptions;
			moment.locale(language);
			moment.defaultFormat = format;
		},
		setDateValue(date) {
			this.$emit("input", date);
		},
		updateDatepickerInput(date) {
			this.$emit("input", date);
		},
		hidePopover() {
			this.isFocused = false;
			this.isPopoverHovered = this.autoHide
				? false
				: this.isPopoverHovered;
		},
		turnOffPopoverHover($event) {
			this.isPopoverHovered = false;
			this.$nextTick(() => {
				if ($event && $event.target) {
					const targetClass = String($event.target.className);
					let prevent = [
						"btn-datepicker",
						"btn-datepicker-icon",
						"btn-year",
						"btn-month",
						"btn-date"
					];

					if (this.trigger) {
						let hasSlices = _.intersection(
							prevent,
							targetClass.split(" ")
						).length;
						if (!hasSlices) {
							this.isPopoverShownOnClick = false;
							this.isFocused = false;
						}
					} else {
						prevent = prevent.concat(["datepicker-input"]);
						let hasSlices = _.intersection(
							prevent,
							targetClass.split(" ")
						).length;

						if (!hasSlices) {
							this.isFocused = false;
						}
					}
				} else {
					// do something
				}
			});
		},
		setCalendarStep(step) {
			if (this.$refs.datepickerCalendar) {
				this.$refs.datepickerCalendar.setStep(step);
			}
		},
		togglePopoverOnTrigger() {
			if (this.trigger) {
				this.isPopoverShownOnClick = !this.isPopoverShownOnClick;
			}
		},
		toggleInputFocus(focusValue) {
			this.isFocused = focusValue;
		}
	},
	watch: {}
};
</script>
<style lang="scss"></style>
