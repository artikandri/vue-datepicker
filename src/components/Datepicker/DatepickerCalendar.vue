<template>
	<div class="datepicker-calendar calendar--wrapper">
		<date-view
			v-show="step == 2"
			:value="value"
			:datepicker-options="datepickerOptions"
			:year-first="yearFirst"
			:auto-hide="autoHide"
			:muted-class="mutedClass"
			:disabled-class="disabledClass"
			:highlighted-class="highlightedClass"
			:picked-class="pickedClass"
			@input:date="setDateValue"
			@click:date-item="$emit('click:date-item')"
			@click:dateButton="setStep"
		/>
		<month-view
			v-show="step == 1"
			:value="value"
			:datepicker-options="datepickerOptions"
			:muted-class="mutedClass"
			:disabled-class="disabledClass"
			:highlighted-class="highlightedClass"
			:picked-class="pickedClass"
			@input:date="setDateValue"
			@click:monthButton="setStep"
		/>
		<year-view
			v-show="step == 0"
			:value="value"
			:datepicker-options="datepickerOptions"
			:muted-class="mutedClass"
			:disabled-class="disabledClass"
			:highlighted-class="highlightedClass"
			:picked-class="pickedClass"
			@input:date="setDateValue"
			@click:yearButton="setStep"
		/>
	</div>
</template>

<script>
import DateView from "@components/Datepicker/DatepickerCalendar/DateView.vue";
import MonthView from "@components/Datepicker/DatepickerCalendar/MonthView.vue";
import YearView from "@components/Datepicker/DatepickerCalendar/YearView.vue";

export default {
	name: "",
	components: {
		DateView,
		MonthView,
		YearView
	},
	props: {
		value: {
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
		},
		yearFirst: {
			type: Boolean,
			default() {
				return false;
			}
		},
		autoHide: {
			type: Boolean,
			default() {
				return false;
			}
		},
		mutedClass: {
			type: String,
			default() {
				return "muted";
			}
		},
		disabledClass: {
			type: String,
			default() {
				return "disabled";
			}
		},
		pickedClass: {
			type: String,
			default() {
				return "picked";
			}
		},
		highlightedClass: {
			type: String,
			default() {
				return "highlighted";
			}
		}
	},
	data() {
		return {
			step: Math.abs(this.datepickerOptions.startView - 2)
		};
	},
	mounted() {},
	destroyed() {},
	methods: {
		setStep(step) {
			this.step = step;
		},
		setDateValue(dateValue) {
			this.$emit("input:date", dateValue);
		}
	}
};
</script>
<style scoped lang="scss"></style>
