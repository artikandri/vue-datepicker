<template>
	<div class="">
		<div class="datepicker-calendar datepicker--month">
			<div class="calendar calendar--month">
				<nav class="calendar-nav">
					<div class="calendar-nav__prev">
						<button
							type="button"
							class="btn btn-datepicker btn-light btn-icon"
							:disabled="!canChangeNavYear(navDate, -1)"
							@click="changeNavYear(-1)"
						>
							<i class="fa fa-chevron-left"></i>
						</button>
					</div>
					<button
						type="button"
						class="btn btn-datepicker btn-light"
						name="monthButton"
						@click="$emit('click:monthButton', 0)"
					>
						<time
							class="btn-datepicker__time"
							:year="navDate.format('YYYY')"
						>
							{{ navDate.format("YYYY") }}
						</time>
					</button>
					<div class="calendar-nav__next">
						<button
							class="btn btn-datepicker btn-light btn-icon"
							type="button"
							:disabled="!canChangeNavYear(navDate, 1)"
							@click="changeNavYear(1)"
						>
							<i class="fa fa-chevron-right"></i>
						</button>
					</div>
				</nav>
				<div class="calendar-container">
					<div class="calendar-body">
						<ul class="calendar-date calendar-month-list">
							<li
								class="calendar-month-list__item"
								:key="'month' + idx"
								v-for="(month, idx) in monthsArr"
							>
								<button
									type="button"
									class="btn btn-month btn-light btn-datepicker month-item"
									:disabled="!month.available"
									@click="selectMonth(month)"
								>
									<time
										class="btn-datepicker__time"
										:month="month.value"
										:year="navDate.format('YYYY')"
									>
										{{ month.value }}
									</time>
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import timeMixin from "@mixins/timeMixin.js";
export default {
	name: "MonthView",
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
			monthsArr: [],
			navDate: moment()
		};
	},
	created() {
		this.setDatepickerLocale();
	},
	mounted() {
		this.setNavDateValue();
		this.setMonths();
	},
	methods: {
		/**
		 * @desc set the nav date value on first load
		 * @param none
		 * @return none
		 */
		setNavDateValue() {
			let { startDate, format } = this.datepickerOptions;
			let dateString = this.value || startDate || null;

			this.navDate = dateString ? moment(dateString, format) : moment();
		},
		/**
		 * @desc set the months array to be displayed on the calendar
		 * @param none
		 * @return none
		 */
		setMonths() {
			const monthsArr = Array.from(Array(12).keys());
			let result = [];
			monthsArr.forEach(month => {
				let momentMonth = moment().month(month);
				result.push({
					value: momentMonth.format("MMM"),
					available: this.checkMonthAvailability(
						momentMonth.format("MM")
					)
				});
			});

			this.monthsArr = [];
			this.$nextTick(() => {
				this.monthsArr = _.cloneDeep(result);
			});
		},
		/**
		 * @desc check the month availability
		 * @param <string> month: the month in MM format (ex: 01 for January)
		 * @return none
		 */
		checkMonthAvailability(month = "01") {
			const navDate = _.cloneDeep(this.navDate);

			// set date to check
			let { startDate, endDate, format } = this.datepickerOptions;
			let startTimestamp = startDate
				? parseInt(moment(startDate, format).format("x"))
				: 0;
			let endTimestamp = endDate
				? parseInt(moment(endDate, format).format("x"))
				: 0;

			// set month to check
			let startMonth = startDate
				? parseInt(moment(startDate, format).format("MM"))
				: 0;
			let endMonth = endDate
				? parseInt(moment(endDate, format).format("MM"))
				: 0;

			let date = "01";
			if (month == startMonth) {
				date = moment(startTimestamp, "x").format("DD");
			} else if (month == endMonth) {
				date = moment(endTimestamp, "x").format("DD");
			} else {
				// do something
			}

			// set date to check
			let currentYear = navDate.format("YYYY");
			let newDate = `${date}-${month}-${currentYear}`;
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
		 * @desc select month and emitted the changed date value
		 * @param <string> month: the month short name
		 * @return none
		 */
		selectMonth(month = {}) {
			let { startDate, endDate, format } = this.datepickerOptions;
			let year = this.navDate.format("YYYY");

			if (month.available) {
				let startMonth = startDate
					? moment(startDate, format).format("MMM")
					: "";
				let endMonth = endDate
					? moment(endDate, format).format("MMM")
					: "";

				let currentMonth = month.value;
				let dateString = moment().format(format);
				if (currentMonth == startMonth) {
					const navDate = _.cloneDeep(this.navDate);
					let date = moment(startDate, format).format("DD");
					dateString = navDate
						.set({ month: startMonth, year: year, date: date })
						.format(format);
				} else if (currentMonth == endMonth) {
					const navDate = _.cloneDeep(this.navDate);
					let date = moment(endDate, format).format("DD");
					dateString = navDate
						.set({ month: endMonth, year: year, date: date })
						.format(format);
				} else {
					const navDate = _.cloneDeep(this.navDate);
					dateString = navDate
						.set({ month: currentMonth, year: year })
						.format(format);
				}

				let isWithinRange = this.timeMixin__canChangeNav(
					{ startDate, endDate, dateString },
					{ format }
				);

				// emit data
				if (isWithinRange) {
					this.$emit("input:date", dateString);
					this.$emit("click:monthButton", 2);
				} else {
					throw new Error(
						`(MonthView.vue) Error when selecting month: The time range should be between ${startDate} to ${endDate ||
							"unknown"}`
					);
				}
			} else {
				throw new Error(
					"(MonthView.vue) Error when selecting month: The selected month is not available"
				);
			}
		},
		/**
		 * @desc set the datepicker locale based on language
		 * @param none
		 * @return none
		 */
		setDatepickerLocale() {
			let localeString = this.datepickerOptions.language || "en";
			moment.locale(localeString);
		},
		/**
		 * @desc check the date
		 * @param 
		 	<string> dateToCheck: the date value to be checked
		 	<number> num: the number of year to be added/substracted from checked date
		 * @return <bool>: true or false
		 */
		canChangeNavYear(dateToCheck = "", num = 1) {
			const clonedDate = moment(dateToCheck);
			clonedDate.add(num, "year");

			let { startDate, endDate, format } = this.datepickerOptions;
			let result = this.timeMixin__canChangeNav(
				{ startDate, endDate, clonedDate },
				{ format, newFormat: "x" }
			);

			return result;
		},
		/**
		 * @desc change the nav year on prev/next nav button click
		 * @param 
		 	<number> num: 
		 		the number of year to be substracted from currently viewed date
		 * @return none
		 */
		changeNavYear(num = 1) {
			if (this.canChangeNavYear(this.navDate, num, "year")) {
				this.navDate.add(num, "year");
			}
			this.$nextTick(() => {
				this.setMonths();
				this.$forceUpdate();
			});
		}
	},
	watch: {
		/**
		 * @desc watching the value from parent and do something when the value changes
		 * @param <string> value: the date value to be checked
		 * @return none
		 */
		value(val) {
			if (val) {
				this.setNavDateValue();
				this.$nextTick(() => {
					this.setMonths();
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
				this.setMonths();
			}
		}
	}
};
</script>
<style scoped lang="scss"></style>
