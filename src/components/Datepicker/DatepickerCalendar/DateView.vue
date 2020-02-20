<template>
	<div class="datepicker-calendar calendar--date-view">
		<div class="calendar">
			<div class="calendar-nav">
				<div class="calendar-nav-previous-month">
					<button
						class="btn btn-ghost btn-icon"
						:disabled="!canChangeNavMonth(navDate, -1)"
						@click="
							changeNavMonth(-1);
							setDates();
						"
					>
						<i class="fa fa-chevron-left"></i>
					</button>
				</div>
				<button name="dateButton" @click="$emit('click:dateButton', 1)">
					{{ navDate.format("MMMM") }}
				</button>
				<button name="dateButton" @click="$emit('click:dateButton', 0)">
					{{ navDate.format("YYYY") }}
				</button>
				<div
					class="calendar-nav-next-month"
					:disabled="!canChangeNavMonth(navDate, 1)"
					@click="
						changeNavMonth(1);
						setDates();
					"
				>
					<button class="btn btn-ghost btn-icon">
						<i class="fa fa-chevron-right"></i>
					</button>
				</div>
			</div>
			<div class="calendar-container">
				<div class="calendar-header">
					<ul class="calendar-week-list">
						<li
							class="calendar-week-list__item"
							:key="'week' + idx"
							v-for="(week, idx) in weekDaysHeaderArr"
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
								v-if="date.value !== 0"
								@click="selectDate(date)"
								class="date-item"
								:disabled="!date.available"
							>
								{{ date.value }}
							</button>
							<button
								v-if="date.value === 0"
								class="date-item btn btn-date"
							></button>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "",
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
		}
	},
	data() {
		return {
			weekDaysHeaderArr: [],
			gridArr: [],
			navDate: moment()
		};
	},
	created() {
		this.setDatepickerLocale();
		this.setNavDateValue();
	},
	mounted() {
		this.setWeekHeader();
		this.setDates();
	},
	computed: {
		monthFormat() {
			let monthFormat = this.yearFirst ? "YYYY MMMM" : "MMMM YYYY";
			return monthFormat;
		}
	},
	methods: {
		setNavDateValue() {
			this.navDate = this.value
				? moment(this.value, this.datepickerOptions.format)
				: moment();
		},
		setDatepickerLocale() {
			let localeString = this.datepickerOptions.language || "en";
			moment.locale(localeString);
		},
		setDates() {
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
					obj.value = i - initialEmptyCells + 1;
					obj.available = true;
				}

				this.gridArr.push(obj);
			}

			this.$nextTick(() => {
				this.$forceUpdate();
			});
		},
		isAvailable(num) {
			let dateToCheck = this.dateFromNum(num, this.navDate);
			if (dateToCheck.isBefore(moment(), "day")) {
				return false;
			} else {
				return true;
			}
		},
		dateFromNum(num, referenceDate) {
			let returnDate = moment(referenceDate);
			return returnDate.date(num);
		},
		canChangeNavMonth(dateToCheck, num) {
			const clonedDate = moment(dateToCheck);
			clonedDate.add(num, "month");

			let canChange = false;

			let { startDate, endDate, format } = this.datepickerOptions;
			let formattedStartDate = startDate
				? moment(startDate, format).format("x")
				: "";
			let formattedEndDate = endDate
				? moment(endDate, format).format("x")
				: "";
			let formattedClonedDate = clonedDate.format("x");

			if (formattedStartDate || formattedEndDate) {
				if (formattedStartDate && formattedEndDate) {
					canChange = clonedDate.isBetween(startDate, endDate);
				} else if (formattedStartDate && !formattedEndDate) {
					canChange = formattedClonedDate >= formattedStartDate;
				} else if (!formattedStartDate && formattedEndDate) {
					canChange = formattedClonedDate <= formattedEndDate;
				} else {
					canChange = false;
				}
			} else {
				canChange = true;
			}
			return canChange;
		},
		changeNavMonth(num) {
			if (this.canChangeNavMonth(this.navDate, num, "month")) {
				this.navDate.add(num, "month");
			}
			this.$nextTick(() => {
				this.$forceUpdate();
			});
		},
		selectDate(date) {
			if (date.available) {
				this.selectedDate = this.dateFromNum(date.value, this.navDate);
				let formattedDate = moment(this.selectedDate).format(
					this.datepickerOptions.format
				);
				this.$emit("input:date", formattedDate);
				if (this.autoHide) {
					this.$emit("click:date-item");
				}
			}
		},
		setWeekHeader() {
			const weekDaysArr = [0, 1, 2, 3, 4, 5, 6];
			weekDaysArr.forEach(day =>
				this.weekDaysHeaderArr.push(
					moment()
						.weekday(day)
						.format("ddd")
				)
			);
		}
	},
	watch: {
		value(val) {
			if (val) {
				this.setNavDateValue();
			}
		}
	}
};
</script>
<style scoped lang="scss"></style>
