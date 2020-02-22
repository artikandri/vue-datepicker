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
		setNavDateValue() {
			let { startDate, format } = this.datepickerOptions;
			let dateString = this.value || startDate || null;

			this.navDate = dateString ? moment(dateString, format) : moment();
		},
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
		checkMonthAvailability(month) {
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

			console.log(newDate);

			let isAvailable = this.timeMixin__compareStartEndDate(
				startTimestamp,
				endTimestamp,
				newDateTimestamp
			);

			return isAvailable;
		},
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
					throw new Error(`The max date is ${endDate || "unknown"}`);
				}
			} else {
				throw new Error("The picked month is unavailable");
			}
		},
		setDatepickerLocale() {
			let localeString = this.datepickerOptions.language || "en";
			moment.locale(localeString);
		},
		canChangeNavYear(dateToCheck, num) {
			const clonedDate = moment(dateToCheck);
			clonedDate.add(num, "year");

			let { startDate, endDate, format } = this.datepickerOptions;
			let result = this.timeMixin__canChangeNav(
				{ startDate, endDate, clonedDate },
				{ format, newFormat: "x" }
			);

			return result;
		},
		changeNavYear(num) {
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
