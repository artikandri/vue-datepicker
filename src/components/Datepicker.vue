<template>
	<div class="datepicker-wrapper">
		<!--start of datepicker input-->
		<datepicker-input
			:value="value"
			:date="datepickerOptions.date"
			:trigger="trigger"
			:auto-pick="autoPick"
			@click:datepickerinputbutton="togglePopoverOnTrigger"
			@update:datepickerinput="updateDatepickerInput"
			@focus="toggleInputFocus"
		></datepicker-input>
		<!--end of datepicker input-->

		<!--start of datepicker popover-->
		<datepicker-popover
			style="background: red;"
			@mouseover.native="isPopoverHovered = true"
			v-click-outside="turnOffPopoverHover"
			v-show="
				(isPopoverShown || isPopoverShownOnClick) && !isContainerShown
			"
		>
			<datepicker-calendar
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
					format: "MM/DD/YYYY",
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
				return true;
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
			isFocused: false,
			isPopoverShownOnClick: false,
			isPopoverHovered: false
		};
	},
	mounted() {
		this.prepareDatepicker();
	},
	computed: {
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
			let isPopoverShown = this.inline ? false : this.isFocused;
			isPopoverShown = this.autoShow ? true : isPopoverShown;
			isPopoverShown = this.isFocused ? true : isPopoverShown;

			return isPopoverShown || this.isPopoverHovered;
		},
		/*
			Returns datepicker options based on the .
			Returns Object.
		*/
		datepickerOptions() {
			let defaultDateFormat = this.options.format || "MM/DD/YYYY";
			let todayDate = moment().format(defaultDateFormat);
			let dateValue =
				this.value || (this.autoPick ? todayDate : null) || null;
			let defaultOptions = {
				date: dateValue,
				format: "MM/DD/YYYY",
				startDate: "10/01/2019",
				endDate: "03/30/2020",
				language: "jp",
				startView: 0,
				weekStart: 0,
				offset: 0,
				zIndex: 1000
			};
			let finalOptions = { ...defaultOptions, ...this.options };
			return finalOptions;
		}
	},
	methods: {
		prepareDatepicker() {
			this.setDatepickerLocale();
		},
		setDatepickerLocale() {
			let localeString = this.datepickerOptions.language || "en";
			moment.locale(localeString);
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
				if (this.trigger && $event && $event.target) {
					const targetClass = String($event.target.className);
					const prevent = ["btn-datepicker", "btn-datepicker-icon"];
					let hasSlices = _.intersection(
						prevent,
						targetClass.split(" ")
					).length;
					if (!hasSlices) {
						this.isPopoverShownOnClick = !this
							.isPopoverShownOnClick;
					}
				}
			});
		},
		togglePopoverOnTrigger() {
			if (this.trigger) {
				this.isPopoverShownOnClick = !this.isPopoverShownOnClick;
			}
		},
		toggleInputFocus(focusValue) {
			this.isFocused = focusValue;
			this.$nextTick(() => {
				// do something
			});
		}
	},
	watch: {}
};
</script>
<style lang="scss"></style>
