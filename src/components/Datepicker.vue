<template>
	<div class="datepicker-wrapper">
		<datepicker-input
			:value="value"
			:date="datepickerOptions.date"
			:auto-pick="autoPick"
			@update:datepickerinput="updateDatepickerInput"
			@focus="toggleInputFocus"
		></datepicker-input>
		<datepicker-popover v-show="isFocused && showPopover">
			<datepicker-calendar></datepicker-calendar>
		</datepicker-popover>
	</div>
</template>

<script>
import DatepickerInput from "@components/Datepicker/DatepickerInput.vue";
import DatepickerPopover from "@components/Datepicker/DatepickerPopover.vue";
import DatepickerCalendar from "@components/Datepicker/DatepickerCalendar.vue";

export default {
	name: "Datepicker",
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
				Shows the calendar popup on first load. Doesnt have any effect in inline view.
			*/
			type: Boolean,
			default() {
				return false;
			}
		},
		autoHide: {
			/*
				Automatically hides the calendar popup after selecting the date. Doesnt have any effect in inline view.
			*/
			type: Boolean,
			default() {
				return false;
			}
		},
		autoPick: {
			/*
				Automatically set today date as default date
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
		DatepickerCalendar
	},
	data() {
		return {
			isFocused: false
		};
	},
	computed: {
		showPopover() {
			let showPopover = this.inline ? false : this.isFocused;
			showPopover = this.autoShow ? true : showPopover;

			return showPopover;
		},
		datepickerOptions() {
			let defaultOptions = {
				date: this.value || null,
				format: "MM/DD/YYYY",
				startDate: null,
				endDate: null,
				language: "en",
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
		updateDatepickerInput(date) {
			this.$emit("input", date);
		},
		toggleInputFocus() {
			this.isFocused = !this.isFocused;
			this.$nextTick(() => {
				// do something
			});
		}
	},
	watch: {}
};
</script>
<style lang="scss"></style>
