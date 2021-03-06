<template>
	<div class="">
		<div class="datepicker-calendar datepicker--year">
			<div class="calendar calendar--year">
				<nav class="calendar-nav">
					<div class="calendar-nav__prev">
						<button
							type="button"
							class="btn btn-datepicker btn-light btn-icon"
							:disabled="!canChangeNavYear(navDate, -4)"
							@click="changeNavYear(-4)"
						>
							<i class="fa fa-chevron-left"></i>
						</button>
					</div>
					<div class="calendar-nav__current">
						<time :from="fromYear" :to="toYear">
							{{ fromYear }}
							-
							{{ toYear }}
						</time>
					</div>
					<div class="calendar-nav__next">
						<button
							type="button"
							class="btn btn-datepicker btn-light btn-icon"
							:disabled="!canChangeNavYear(navDate, 4)"
							@click="changeNavYear(4)"
						>
							<i class="fa fa-chevron-right"></i>
						</button>
					</div>
				</nav>
				<main class="calendar-container">
					<div class="calendar-body">
						<ul class="calendar-date calendar-year-list">
							<li
								class="calendar-year-list__item"
								:key="'year' + idx"
								v-for="(year, idx) in yearsArr"
								:class="yearClass(year)"
							>
								<button
									type="button"
									@click="selectYear(year)"
									class="btn btn-year btn-light year-item btn-datepicker"
									:disabled="!year.available"
								>
									<time
										class="btn-datepicker__time"
										:year="year.value"
									>
										{{ year.value }}
									</time>
								</button>
							</li>
						</ul>
					</div>
				</main>
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
			const navDate = this.value
				? moment(this.value, this.datepickerOptions.format)
				: moment();
			return navDate.add(-4, "year").format("YYYY");
		},
		/**
		 * @desc retrieve the last year of the range displayed on the calendar
		 * @param none
		 * @return String in YYYY format (ex: 2010)
		 */
		toYear() {
			const navDate = this.value
				? moment(this.value, this.datepickerOptions.format)
				: moment();
			return navDate.add(4, "year").format("YYYY");
		}
	},
	methods: {
		/**
		 * @desc check the datepicker options and the selected year value
		 * @param <object> selected year
		 * @return <string>  class name for selected year: highlighted, muted, ...
		 */
		yearClass(year = {}) {
			let todayYear = moment().format("YYYY");
			let currentYear = this.navDate.format("YYYY");
			let highlightedClass =
				todayYear == year.value ? this.highlightedClass : "";
			let availableClass = year.available ? "" : this.disabledClass;
			let mutedClass = year.available ? "" : this.mutedClass;
			let pickedClass = currentYear == year.value ? this.pickedClass : "";

			let yearClass = `${highlightedClass} ${availableClass} ${mutedClass} ${pickedClass}`;
			return yearClass;
		},
		/**
		 * @desc set the nav date value by checking the value first
		 * @param none
		 * @return none
		 */
		setNavDateValue() {
			let { startDate, format } = this.datepickerOptions;
			let dateString = this.value || startDate || null;

			this.navDate = dateString ? moment(dateString, format) : moment();
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
		selectYear(year = {}) {
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
			} else {
				throw new Error(
					"(YearView.vue) Error when selecting year: The selected year is not available"
				);
			}
		},
		/**
		 * @desc check the year availability
		 * @param none
		 * @return bool: true or false
		 */
		checkYearAvailability(year = 0) {
			let { startDate, endDate, format } = this.datepickerOptions;
			// format the date
			year = parseInt(year);
			let dateString = moment(startDate, format)
				.set({ year: year })
				.format(format);
			let isWithinRange = this.timeMixin__canChangeNav(
				{
					startDate,
					endDate,
					dateString
				},
				{ format, newFormat: "YYYY" }
			);

			return isWithinRange;
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
		canChangeNavYear(dateToCheck = "", num = 1) {
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
		changeNavYear(num = 1) {
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
				this.setYears();
			}
		}
	}
};
</script>
<style scoped lang="scss"></style>
