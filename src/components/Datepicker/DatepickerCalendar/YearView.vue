<template>
	<div class="">
		<div class="datepicker-calendar calendar--date-view">
			<div class="calendar">
				<div class="calendar-nav">
					<div class="calendar-nav-previous-year">
						<button
							class="btn btn-ghost btn-icon"
							:disabled="!canChangeNavYear(navDate, -4)"
							@click="changeNavYear(-4)"
						>
							<i class="fa fa-chevron-left"></i>
						</button>
					</div>
					{{ fromYear }}
					-
					{{ toYear }}
					<div
						class="calendar-nav-next-year"
						:disabled="!canChangeNavYear(navDate, 4)"
						@click="changeNavYear(4)"
					>
						<button class="btn btn-ghost btn-icon">
							<i class="fa fa-chevron-right"></i>
						</button>
					</div>
				</div>
				<div class="calendar-container">
					<div class="calendar-body">
						<ul class="calendar-date calendar-date-list">
							<li
								class="calendar-date-list__item"
								:key="'year' + idx"
								@click="selectYear(year)"
								v-for="(year, idx) in yearsArr"
							>
								<button
									class="btn btn-year year-item"
									:disabled="!year.available"
								>
									{{ year.value }}
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
import timeMixin from "@mixins/timeMixin";
export default {
	name: "YearView",
	mixins: [timeMixin],
	props: {
		/**
		 * @desc retrieve the datepicker input value entered by user
		 * @param none
		 * @return String -
		 */
		value: {
			type: String,
			default() {
				return "";
			}
		},
		/**
		 * @desc retrieve the datepicker options
		 * @param none
		 * @return Object
		 */
		datepickerOptions: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			yearsArr: [],
			navDate: moment()
		};
	},
	created() {
		this.setDatepickerLocale();
	},
	mounted() {
		this.setNavDateValue();
		this.setYears();
	},
	computed: {
		/**
		 * @desc retrieve the first year of the range displayed on the calendar
		 * @param none
		 * @return String in YYYY format (ex: 2010)
		 */
		fromYear() {
			return moment(this.value, this.datepickerOptions.format)
				.add(-4, "year")
				.format("YYYY");
		},
		/**
		 * @desc retrieve the last year of the range displayed on the calendar
		 * @param none
		 * @return String in YYYY format (ex: 2010)
		 */
		toYear() {
			return moment(this.value, this.datepickerOptions.format)
				.add(4, "year")
				.format("YYYY");
		}
	},
	methods: {
		/**
		 * @desc set the nav date value by checking the value first
		 * @param none
		 * @return none
		 */
		setNavDateValue() {
			this.navDate = this.value
				? moment(this.value, this.datepickerOptions.format)
				: moment();
		},
		/**
		 * @desc set the year array
		 * @param none
		 * @return none
		 */
		setYears() {
			const navDate = _.cloneDeep(this.navDate);
			const currentYear = navDate.add(-5, "year");

			// generate array
			let result = [];
			let i = 0;
			while (i < 9) {
				let value = currentYear.add(1, "year").format("YYYY");
				result.push({
					value,
					available: this.checkYearAvailability(value)
				});
				i++;
			}

			// set array
			this.yearsArr = [];
			this.$nextTick(() => {
				this.yearsArr = _.sortBy(result, "value");
			});
		},
		/**
		 * @desc check the year availability, then set the value if the year were invalid
		 * @param none
		 * @return none
		 */
		selectYear(year) {
			let { format } = this.datepickerOptions;
			let selectionFormat = "DD MMM YYYY";
			if (year.available) {
				let formattedValue = moment(this.value, format).format(
					selectionFormat
				);
				let split = formattedValue.split(" ");
				split[2] = year.value;
				let date = moment(split.join(" "), selectionFormat).format(
					format
				);

				this.$emit("input:date", date);
				this.$emit("click:yearButton", 1);
			}
		},
		/**
		 * @desc check the year availability
		 * @param none
		 * @return bool: true or false
		 */
		checkYearAvailability(year) {
			let { startDate, endDate, format } = this.datepickerOptions;
			let startYear = startDate
				? moment(startDate, format).format("YYYY")
				: 0;
			startYear = parseInt(startYear);
			let endYear = endDate ? moment(endDate, format).format("YYYY") : 0;
			endYear = parseInt(endYear);
			let currentYear = endDate
				? moment(this.value, format).format("YYYY")
				: 0;
			currentYear = parseInt(currentYear);

			let isNextYear = year > currentYear;

			return isNextYear ? year <= endYear : year >= startYear;
		},
		/**
		 * @desc set the moment locale from available options
		 * @param none
		 * @return none
		 */
		setDatepickerLocale() {
			let localeString = this.datepickerOptions.language || "en";
			moment.locale(localeString);
		},
		/**
		 * @desc check the ability to navigate to previous month
		 * @param none
		 * @return bool: true or false
		 */
		canChangeNavYear(dateToCheck, num) {
			const clonedDate = moment(dateToCheck);
			clonedDate.add(num, "year");

			let { startDate, endDate, format } = this.datepickerOptions;
			let canChange = this.timeMixin__canChangeNav(
				{ startDate, endDate, clonedDate },
				{ format, newFormat: "x" }
			);

			return canChange;
		},
		/**
		 * @desc set the year if the navDate were available
		 * @param none
		 * @return none
		 */
		changeNavYear(num) {
			if (this.canChangeNavYear(this.navDate, num)) {
				this.navDate.add(num, "year");

				this.$nextTick(() => {
					this.setYears();
					this.$forceUpdate();
				});
			}
		}
	},
	watch: {
		value(val) {
			if (val) {
				this.setNavDateValue();
				this.$nextTick(() => {
					this.setYears();
					this.$forceUpdate();
				});
			}
		}
	}
};
</script>
<style scoped lang="scss"></style>
