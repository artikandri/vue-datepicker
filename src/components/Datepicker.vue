<template>
	<div class="datepicker-wrapper">
		<!--start of datepicker input-->
		<datepicker-input
			ref="datepickerInput"
			:value="value"
			:date="datepickerOptions.date"
			:trigger="trigger"
			:auto-pick="autoPick"
			:datepicker-options="datepickerOptions"
			@click:datepickerInputButton="togglePopoverOnTrigger"
			@change:setStep="setCalendarStep"
			@update:datepickerInput="updateDatepickerValue"
			@focus="toggleInputFocus"
		></datepicker-input>
		<!--end of datepicker input-->

		<!--start of datepicker popover-->
		<datepicker-popover
			ref="datepickerPopover"
			@mouseover.native="isPopoverHovered = true"
			v-click-outside.native="turnOffPopoverHover"
			v-if="showPopover"
		>
			<datepicker-calendar
				ref="datepickerCalendar"
				:value="value"
				@click:date-item="hidePopover"
				@input:date="updateDatepickerValue"
				:datepicker-options="datepickerOptions"
				:year-first="yearFirst"
				:auto-hide="autoHide"
			></datepicker-calendar>
		</datepicker-popover>
		<!--end of datepicker popover-->

		<!--start of datepicker container-->
		<datepicker-container ref="datepickerContainer" v-if="container">
			<datepicker-calendar
				ref="datepickerCalendar"
				v-if="isContainerShown"
				:value="value"
				@click:date-item="hidePopover"
				@input:date="updateDatepickerValue"
				:datepicker-options="datepickerOptions"
				:year-first="yearFirst"
				:auto-hide="autoHide"
			></datepicker-calendar>
		</datepicker-container>
		<!--end of datepicker container-->
	</div>
</template>

<script>
import timeMixin from "@mixins/timeMixin";
import DatepickerInput from "@components/Datepicker/DatepickerInput.vue";
import DatepickerPopover from "@components/Datepicker/DatepickerPopover.vue";
import DatepickerCalendar from "@components/Datepicker/DatepickerCalendar.vue";
import DatepickerContainer from "@components/Datepicker/DatepickerContainer.vue";

export default {
	name: "Datepicker",
	mixins: [timeMixin],
	props: {
		value: {
			type: String,
			default() {
				return "";
			}
		},
		options: {
			/**
			 * @desc
			 	Customized options for the datepicker
				{
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
			 * @param none
			 * @return <object>
			 */
			type: Object,
			default() {
				return {};
			}
		},
		/**
		 * @desc
				When activated, append a container under the datepicker input to contain the calendar. Only works when the inline option were set as TRUE; otherwise the container will be empty
		 * @param none
		 * @return <bool>: true or false
		 */
		container: {
			/*
			 */
			type: Boolean,
			default() {
				return false;
			}
		},
		/**
		 * @desc
				Changes the input behavior. When activated, the calendar will only appear when the user clicked on the "calendar" icon; instead of the textbox.
		 * @param none
		 * @return <bool>: true or false
		 */
		trigger: {
			type: Boolean,
			default() {
				return false;
			}
		},
		/**
		 * @desc
				Append the calendar directly under the input instead of popping up on click.
				Only works when the container option were set as TRUE; otherwise the calendar will not show up
		 * @param none
		 * @return <bool>: true or false
		 */
		inline: {
			type: Boolean,
			default() {
				return false;
			}
		},
		/**
		 * @desc
				Shows the calendar popup on first load.
				Doesnt affect inline view.
		 * @param none
		 * @return <bool>: true or false
		 */
		autoShow: {
			type: Boolean,
			default() {
				return false;
			}
		},
		/**
		 * @desc
				Automatically hides the calendar popup after selecting the date.
				Doesnt affect inline view.
		 * @param none
		 * @return <bool>: true or false
		 */
		autoHide: {
			type: Boolean,
			default() {
				return false;
			}
		},
		/**
		 * @desc Automatically set today date as default date. Only works on first run.
		 * @param none
		 * @return <bool>: true or false
		 */
		autoPick: {
			type: Boolean,
			default() {
				return false;
			}
		},
		/**
		 * @desc Show the year before the month's name in the calendar month view's title
		 * @param none
		 * @return <bool>: true or false
		 */
		yearFirst: {
			/*

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
			isPopoverInTrigger: false,
			isPopoverHovered: false
		};
	},
	mounted() {
		this.setDatepickerLocale();
	},
	computed: {
		/**
		 * @desc Show/hide the popover based on multiple params
		 * @param none
		 * @return <bool>: true or false
		 */
		showPopover() {
			return (
				(this.isPopoverShown || this.isPopoverInTrigger) &&
				!this.isContainerShown
			);
		},
		/**
		 * @desc Show/hide the container based on the inline and the container value.
		 * @param none
		 * @return <bool>: true or false
		 */
		isContainerShown() {
			let isContainerShown = this.inline && this.container;
			return isContainerShown;
		},
		/**
		 * @desc Shows/hides the popover based on the inline and the isFocused value.
		 * @param none
		 * @return <bool>: true or false
		 */
		isPopoverShown() {
			let isPopoverShown = this.inline === true;
			isPopoverShown = this.isFocused ? true : isPopoverShown;

			return isPopoverShown || this.isPopoverHovered;
		},
		/**
		 * @desc Check the options set and returns it after merged them with default options.
		 * @param none
		 * @return <object>
		 */
		datepickerOptions() {
			let { startDate, endDate, format } = this.options;
			const defaultDateFormat = format || "DD/MM/YYYY";

			const todayDate = moment().format(defaultDateFormat);
			const autoPickDate = this.autoPick ? todayDate : null;
			const dateString = this.value || autoPickDate || null;

			// reset the startDate & endDate if the format entered is not valid
			startDate = this.checkInputValidity(startDate, format)
				? startDate
				: "";
			endDate = this.checkInputValidity(endDate, format) ? endDate : "";

			let isStartDateValid = true;
			let isEndDateValid = true;

			if (startDate) {
				isEndDateValid = endDate
					? moment(endDate, format).isSameOrAfter(
							moment(startDate, format)
					  )
					: isEndDateValid;
			}

			if (endDate) {
				isStartDateValid = startDate
					? moment(startDate, format).isSameOrBefore(
							moment(endDate, format)
					  )
					: isStartDateValid;
			}

			// reset startDate and endDate when the value is not valid
			startDate = isStartDateValid ? startDate : "";
			endDate = isEndDateValid ? endDate : "";

			// default options
			const defaultOptions = {
				date: dateString,
				format: "DD/MM/YYYY",
				startDate: "",
				endDate: "",
				language: "en",
				startView: 0,
				weekStart: 0,
				offset: 0,
				zIndex: 1000
			};

			let options = { ...this.options, ...{ startDate, endDate } };
			const finalOptions = { ...defaultOptions, ...options };

			return finalOptions;
		}
	},
	methods: {
		/**
		 * @desc Set the datepicker locale based on the datepicker options
		 * @param none
		 * @return none
		 */
		setDatepickerLocale() {
			let { language, format } = this.datepickerOptions;
			moment.locale(language);
			moment.defaultFormat = format;
		},
		/**
		 * @desc Emitted the date value from children component
		 * @param <string> date value from children component
		 * @return none
		 */
		updateDatepickerValue(date) {
			this.$emit("input", date);
		},
		/**
		 * @desc Set the focused value and hides it when the autoHide option were set as true
		 * @param none
		 * @return none
		 */
		hidePopover() {
			this.isFocused = false;
			this.isPopoverHovered = this.autoHide
				? false
				: this.isPopoverHovered;
		},
		/**
		 * @desc Set the values required to hide the popover when not hovered
		 * @param <object> $event: Javascript click event
		 * @return none
		 */
		turnOffPopoverHover($event) {
			this.$nextTick(() => {
				if ($event && $event.target) {
					const targetClass = String($event.target.className);
					let prevent = [
						"btn-datepicker",
						"btn-datepicker-icon",
						"btn-year",
						"datepicker-popover",
						"btn-month",
						"btn-date"
					];

					let hasSlices = false;
					if (this.trigger) {
						hasSlices = _.intersection(
							prevent,
							targetClass.split(" ")
						).length;

						if (!hasSlices) {
							this.isPopoverInTrigger = false;
						}
					} else {
						prevent = prevent.concat(["datepicker-input"]);
						hasSlices = _.intersection(
							prevent,
							targetClass.split(" ")
						).length;
					}

					if (!hasSlices) {
						this.isFocused = false;
						this.isPopoverHovered = false;
					}
				} else {
					// do something
				}
			});
		},
		/**
		 * @desc Set the calendar view based on user click activity
		 * @param <number> step: 0, 1, 2
		 * @return none
		 */
		setCalendarStep(step) {
			if (step < 3 && step >= 0) {
				if (this.$refs.datepickerCalendar) {
					this.$refs.datepickerCalendar.setStep(step);
				}
			}
		},
		/**
		 * @desc Toggle the value required to show/hide popover, when it is in trigger mode
		 * @param none
		 * @return none
		 */
		togglePopoverOnTrigger() {
			if (this.trigger) {
				this.isPopoverInTrigger = !this.isPopoverInTrigger;
			}
		},
		/**
		 * @desc Toggle the value required to set the input focus
		 * @param <bool> focusValue:  true or false
		 * @return none
		 */
		toggleInputFocus(focusValue) {
			this.isFocused = focusValue;
		},
		/**
		 * @desc check the dateString validity by comparing it with the format
		 * @param String: dateString
		 * @return bool: true or false
		 */
		checkInputValidity(dateString = "", format = "") {
			return moment(dateString, format, true).isValid();
		},
		getDate(formatted = false) {
			let { format } = this.datepickerOptions;
			let date = "";
			if (formatted) {
				date = this.value
					? moment(this.value, format).format(format)
					: moment().format(format);
			} else {
				let dateString = this.value
					? moment(this.value, format).format("DD/MM/YYYY")
					: "";
				date = this.value
					? Date(dateString).toString()
					: Date().toString();
			}
			return date;
		},
		getMonthName(short = false) {
			let { format } = this.datepickerOptions;
			let month = "";
			if (short) {
				month = this.value
					? moment(this.value, format).format("MMM")
					: moment().format("MMM");
			} else {
				month = this.value
					? moment(this.value, format).format("MMMM")
					: moment().format("MMMM");
			}
			return month;
		},
		getDayName(dayFormat = null) {
			let { format } = this.datepickerOptions;
			let dayName = "";
			if (dayFormat === "short") {
				dayName = this.value
					? moment(this.value, format).format("ddd")
					: moment().format("ddd");
			} else if (dayFormat === "min") {
				dayName = this.value
					? moment(this.value, format).format("dd")
					: moment().format("dd");
			} else {
				dayName = this.value
					? moment(this.value, format).format("dddd")
					: moment().format("dddd");
			}
			return dayName;
		},
		show() {
			if (!this.inline) {
				this.isFocused = true;
			}
		},
		hide() {
			this.isFocused = false;
		},
		pick() {
			let { format } = this.datepickerOptions;
			let dateString = this.value
				? moment(this.value, format).format(format)
				: "";
			let date = this.value ? dateString : moment().format(format);

			this.$emit("input", date);
		},
		update(date = "") {
			let { startDate, endDate, format } = this.datepickerOptions;
			let previousPickedDate = this.value;
			let dateString = moment(date, format).isValid()
				? date
				: previousPickedDate;

			let isWithinRange = this.timeMixin__canChangeNav(
				{ startDate, endDate, dateString },
				{ format }
			);

			if (isWithinRange) {
				this.$emit("input", dateString);
			} else {
				let errorMessage = `(Datepicker.vue) Error in updating the date: Please enter date between ${startDate} and ${endDate}`;
				throw new Error(errorMessage);
			}
		},
		reset() {
			this.$emit("input", "");
			if (this.isContainerShown) {
				this.$refs.datepickerCalendar.$destroy();
				this.$nextTick(() => {
					this.$refs.datepickerCalendar.$mount();
				});
			} else {
				this.$refs.datepickerPopover.$destroy();
				this.$nextTick(() => {
					this.$refs.datepickerPopover.$mount();
				});
			}
		},
		destroy() {
			if (this.isContainerShown) {
				this.$refs.datepickerCalendar.$destroy();
				this.$nextTick(() => {
					this.$forceUpdate();
				});
			} else {
				this.$refs.datepickerPopover.$destroy();
				this.$nextTick(() => {
					this.$forceUpdate();
				});
			}
		}
	},
	watch: {}
};
</script>
<style lang="scss"></style>
