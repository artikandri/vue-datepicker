<template>
	<div class="">
		<div class="datepicker-calendar calendar--date-view">
			<div class="calendar">
				<div class="calendar-nav">
					<div class="calendar-nav-previous-month">
						<button
							type="button"
							class="btn btn-ghost btn-icon"
							:disabled="!canChangeNavYear(navDate, -1)"
							@click="changeNavYear(-1)"
						>
							<i class="fa fa-chevron-left"></i>
						</button>
					</div>
					<button
						name="monthButton"
						@click="$emit('click:monthButton', 0)"
					>
						{{ navDate.format("YYYY") }}
					</button>
					<div class="calendar-nav-next-month">
						<button
							class="btn btn-ghost btn-icon"
							type="button"
							:disabled="!canChangeNavYear(navDate, 1)"
							@click="changeNavYear(1)"
						>
							<i class="fa fa-chevron-right"></i>
						</button>
					</div>
				</div>
				<div class="calendar-container">
					<div class="calendar-body">
						<ul class="calendar-date calendar-date-list">
							<li
								class="calendar-date-list__item"
								:key="'month' + idx"
								@click="selectMonth(month)"
								v-for="(month, idx) in monthsArr"
							>
								<button
									class="btn btn-month month-item"
									:disabled="!month.available"
								>
									{{ month.value }}
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
		selectMonth(month = "Jan") {
			let { startDate, endDate, format } = this.datepickerOptions;
			let selectionFormat = "DD MMM YYYY";
			let year = this.navDate.format("YYYY");
			if (month.available) {
				let formattedValue = moment(this.value, format).format(
					selectionFormat
				);
				let split = formattedValue.split(" ");
				split[1] = month.value;
				split[2] = year;
				let date = moment(split.join(" "), selectionFormat).format(
					format
				);

				let isWithinRange = this.timeMixin__canChangeNav(
					{ startDate, endDate, dateString: date },
					{ format }
				);
				if (isWithinRange) {
					this.$emit("input:date", date);
					this.$emit("click:monthButton", 2);
				} else {
					throw new Error(
						`(MonthView.vue) Error when selecting month: The max date is ${endDate ||
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
		}
	}
};
</script>
<style scoped lang="scss"></style>
