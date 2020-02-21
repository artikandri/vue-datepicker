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
export default {
	name: "YearView",
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
		fromYear() {
			return moment(this.value, this.datepickerOptions.format)
				.add(-4, "year")
				.format("YYYY");
		},
		toYear() {
			return moment(this.value, this.datepickerOptions.format)
				.add(4, "year")
				.format("YYYY");
		}
	},
	methods: {
		setNavDateValue() {
			this.navDate = this.value
				? moment(this.value, this.datepickerOptions.format)
				: moment();
		},
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
		setDatepickerLocale() {
			let localeString = this.datepickerOptions.language || "en";
			moment.locale(localeString);
		},
		canChangeNavYear(dateToCheck, num) {
			const clonedDate = moment(dateToCheck);
			clonedDate.add(num, "year");

			let canChange = false;
			let { startDate, endDate, format } = this.datepickerOptions;

			// set year to check
			let startYear = startDate
				? parseInt(moment(startDate, format).format("YYYY"))
				: 0;
			let endYear = endDate
				? parseInt(moment(endDate, format).format("YYYY"))
				: 0;
			let clonedYear = endDate ? parseInt(clonedDate.format("YYYY")) : 0;

			if (startYear || endYear) {
				if (startYear && endYear) {
					canChange =
						clonedYear >= startYear && clonedYear <= endYear;
				} else if (startYear && !endYear) {
					canChange = clonedYear >= startYear;
				} else if (!startYear && endYear) {
					canChange = clonedYear <= endYear;
				} else {
					// do something
				}
			} else {
				canChange = true;
			}

			return canChange;
		},
		changeNavYear(num) {
			if (this.canChangeNavYear(this.navDate, num)) {
				this.navDate.add(num, "year");
			}

			this.$nextTick(() => {
				this.setYears();
				this.$forceUpdate();
			});
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
