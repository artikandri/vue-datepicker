<template>
	<div class="datepicker-calendar datepicker--date">
		<div class="calendar calendar--date">
			<nav class="calendar-nav">
				<div class="calendar-nav-previous-month">
					<button
						type="button"
						class="btn btn-datepicker btn-nav btn-icon"
						:disabled="!canChangeNavMonth(navDate, -1)"
						@click="
							changeNavMonth(-1);
							setDates();
						"
					>
						<i class="fa fa-chevron-left" aria-hidden="true"></i>
					</button>
				</div>
				<button
					type="button"
					name="dateButton"
					class="btn btn-datepicker btn-default"
					@click="$emit('click:dateButton', 0)"
				>
					{{ navDate.format(monthFormat) }}
				</button>
				<div class="calendar-nav-next-month">
					<button
						type="button"
						class="btn btn-datepicker btn-icon"
						:disabled="!canChangeNavMonth(navDate, 1)"
						@click="
							changeNavMonth(1);
							setDates();
						"
					>
						<i class="fa fa-chevron-right" aria-hidden="true"></i>
					</button>
				</div>
			</nav>
			<main class="calendar-container">
				<div class="calendar-header">
					<ul class="calendar-week-list">
						<li
							class="calendar-week-list__item"
							:key="'week' + idx"
							v-for="(week, idx) in weekDaysArr"
						>
							{{ week }}
						</li>
					</ul>
				</div>
				<div class="calendar-body">
					<ul class="calendar-date calendar-date-list">
						<li
							class="calendar-date-list__item"
							:key="'date' + idx"
							v-for="(date, idx) in gridArr"
						>
							<button
								type="button"
								v-if="date.value !== 0"
								@click="selectDate(date)"
								class="btn btn-date btn-datepicker btn-default date-item"
								:disabled="!date.available"
							>
								<time
									:date="date.value"
									:month="navDate.format('MMMM')"
									:year="navDate.format('YYYY')"
								>
									{{ date.value }}
								</time>
							</button>
							<button
								type="button"
								disabled
								v-if="date.value === 0"
								class="btn btn-date btn-datepicker btn-default date-item"
							>
								<time date=""></time>
							</button>
						</li>
					</ul>
				</div>
			</main>
		</div>
	</div>
</template>

<script>
import timeMixin from "@mixins/timeMixin.js";

export default {
	name: "DateView",
	mixins: [timeMixin],
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
			weekDaysArr: [],
			gridArr: [],
			navDate: moment()
		};
	},
	created() {
		this.setDatepickerLocale();
	},
	mounted() {
		this.setNavDateValue();
		this.setWeekHeader();
		this.setDates();
	},
	computed: {
		/**
		 * @desc get the yearFirst option from the parent
		 		and return the display format for the month and year
		 * @param none
		 * @return String: monthFormat
		 */
		monthFormat() {
			let monthFormat = this.yearFirst ? "YYYY MMMM" : "MMMM YYYY";
			return monthFormat;
		}
	},
	methods: {
		/**
		 * @desc set the navDate value based on the value and format from parent
		 * @param none
		 * @return none
		 */
		setNavDateValue() {
			let { startDate, format } = this.datepickerOptions;
			let dateString = this.value || startDate || null;

			this.navDate = dateString ? moment(dateString, format) : moment();
		},
		/**
		 * @desc set the moment locale based on the option from parent
		 * @param none
		 * @return none
		 */
		setDatepickerLocale() {
			let localeString = this.datepickerOptions.language || "en";
			moment.locale(localeString);
		},
		/**
		 * @desc set the dates array based on the navDate value
		 * @param none
		 * @return none
		 */
		setDates() {
			const base = this;
			this.gridArr = [];

			const firstDayDate = moment(this.navDate).startOf("month");
			const initialEmptyCells = firstDayDate.weekday();
			const lastDayDate = moment(this.navDate).endOf("month");
			const lastEmptyCells = 6 - lastDayDate.weekday();
			const daysInMonth = this.navDate.daysInMonth();
			const arrayLength =
				initialEmptyCells + lastEmptyCells + daysInMonth;

			for (let i = 0; i < arrayLength; i++) {
				let obj = {};
				if (
					i < initialEmptyCells ||
					i > initialEmptyCells + daysInMonth - 1
				) {
					obj.value = 0;
					obj.available = false;
				} else {
					let date = i - initialEmptyCells + 1;
					obj.value = date;
					obj.available = base.checkDateAvailability(date);
				}

				base.gridArr.push(obj);
			}

			this.$nextTick(() => {
				this.$forceUpdate();
			});
		},
		/**
		 * @desc check the date availability based on the startDate and endDate
		 * @param <number> date: the date to be calculated
		 * @return <bool> isAvailable: true or false
		 */
		checkDateAvailability(date = 1) {
			date = String(date).length == 1 ? `0${date}` : date;
			const navDate = _.cloneDeep(this.navDate);

			let { startDate, endDate, format } = this.datepickerOptions;
			let startTimestamp = startDate
				? parseInt(moment(startDate, format).format("x"))
				: 0;
			let endTimestamp = endDate
				? parseInt(moment(endDate, format).format("x"))
				: 0;

			let currentViewedMonthYear = navDate.format("MM-YYYY");
			let newDate = `${date}-${currentViewedMonthYear}`;
			let newDateTimestamp = parseInt(
				moment(newDate, "DD-MM-YYYY").format("x")
			);

			let isAvailable = this.timeMixin__compareStartEndDate(
				startTimestamp,
				endTimestamp,
				newDateTimestamp
			);

			return isAvailable;
		},
		/**
		 * @desc return new date from referenced date and number
		 * @param
		 		<object> dateToCheck: the date to be checked, refers to the navDate
		 		<number> num: the number of month to be added/substracted from currently
		 				viewed month
		 * @return none
		 */
		dateFromNum(num = 1, referenceDate = "") {
			let returnDate = moment(referenceDate);
			return returnDate.date(num);
		},
		/**
		 * @desc check the current date and the number of month to be added/substracted
		 * @param
		 		<object> dateToCheck: the date to be checked, refers to the navDate
		 		<number> num: the number of month to be added/substracted from currently
		 				viewed month
		 * @return none
		 */
		canChangeNavMonth(dateToCheck = "", num = 1) {
			let { startDate, endDate, format } = this.datepickerOptions;
			let clonedDate = moment(dateToCheck);
			clonedDate.add(num, "month");

			// set month to be checked
			let clonedMonth = clonedDate.format("MMMM");
			let startMonth = moment(startDate, format).format("MMMM");
			let endMonth = moment(endDate, format).format("MMMM");

			// set clonedDate
			if (clonedMonth == startMonth) {
				clonedDate.set({
					month: startMonth,
					date: moment(startDate, format).format("DD")
				});
			} else if (clonedMonth == endMonth) {
				let date = new Date(endDate).getDate();
				clonedDate.set({
					date,
					month: endMonth
				});
			} else {
				clonedDate.set({ month: clonedMonth, date: "01" });
			}

			let result = this.timeMixin__canChangeNav(
				{ startDate, endDate, clonedDate },
				{ format, newFormat: "x" }
			);

			return result;
		},
		/**
		 * @desc change the navDate on month navigation (prev or next)
		 * @param <number> num: the number of month to be added/substracted
		 * @return none
		 */
		changeNavMonth(num = 0) {
			if (this.canChangeNavMonth(this.navDate, num, "month")) {
				this.navDate.add(num, "month");
			}
			this.$nextTick(() => {
				this.$forceUpdate();
			});
		},
		/**
		 * @desc check the date and emitted the date to the parent on click
		 * @param <object> date: the date to be checked and emitted
		 * @return none
		 */
		selectDate(date = {}) {
			let { startDate, endDate, format } = this.datepickerOptions;
			if (date.available) {
				this.selectedDate = this.dateFromNum(date.value, this.navDate);
				let dateString = moment(this.selectedDate).format(format);
				let isWithinRange = this.timeMixin__canChangeNav(
					{ startDate, endDate, dateString },
					{ format, newFormat: "x" }
				);

				if (
					isWithinRange &&
					String(dateString).toLowerCase() !== "invalid date"
				) {
					this.$emit("input:date", dateString);
					if (this.autoHide) {
						this.$emit("click:date-item");
					}
				} else {
					throw new Error(
						"(DateView.vue) Error when selecting date: The selected date is not within time range or invalid"
					);
				}
			} else {
				throw new Error(
					"(DateView.vue) Error when selecting date: The selected date is not available"
				);
			}
		},
		/**
		 * @desc set the week header (weekDaysArr) based on the moment locale
		 * @param none
		 * @return none
		 */
		setWeekHeader() {
			const weekDaysArr = [0, 1, 2, 3, 4, 5, 6];
			let weekDays = [];
			weekDaysArr.forEach(day =>
				weekDays.push(
					moment()
						.weekday(day)
						.format("ddd")
				)
			);
			this.weekDaysArr = weekDays;
		}
	},
	watch: {
		/**
		 * @desc watch the value from parent v-model and do something when it changes
		 * @param <string> value: the date to be checked
		 * @return none
		 */
		value(val) {
			if (val) {
				this.setNavDateValue();
				this.$nextTick(() => {
					this.setDates();
				});
			}
		},
		/**
		 * @desc watch the datepickerOptions and do something when it changes
		 * @param <object> value: the date to be checked
		 * @return none
		 */
		datepickerOptions(val) {
			if (val) {
				this.setDatepickerLocale();
				this.setNavDateValue();
				this.setWeekHeader();
				this.setDates();
			}
		}
	}
};
</script>
<style scoped lang="scss"></style>
