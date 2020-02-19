<template>
	<div class="">
		month view
		<button name="monthButton" @click="$emit('click:monthButton', 0)">
			2010
		</button>

		<div class="datepicker-calendar calendar--date-view">
			<div class="calendar">
				<div class="calendar-nav">
					<div class="calendar-nav-previous-month">
						<button
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
					<div
						class="calendar-nav-next-month"
						:disabled="!canChangeNavYear(navDate, 1)"
						@click="changeNavYear(1)"
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
								:key="'month' + idx"
								@click="selectMonth(month)"
								v-for="(month, idx) in monthsArr"
							>
								<button
									class="date-item"
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
export default {
	name: "MonthView",
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
		this.setMonths();
	},
	methods: {
		setMonths() {
			const monthsArr = Array.from(Array(12).keys());
			monthsArr.forEach(month =>
				this.monthsArr.push({
					value: moment()
						.month(month)
						.format("MMM"),
					available: true
				})
			);
		},
		selectMonth(month) {
			let { format } = this.datepickerOptions;
			let selectionFormat = "DD MMM YYYY";
			if (month.available) {
				let formattedValue = moment(this.value, format).format(
					selectionFormat
				);
				let split = formattedValue.split(" ");
				split[1] = month.value;
				let date = moment(split.join(" "), selectionFormat).format(
					format
				);

				this.$emit("input:date", date);
				this.$emit("click:monthButton", 2);
			}
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
			let formattedStartDate = startDate
				? moment(startDate, format).format("YYYY")
				: "";
			let formattedEndDate = endDate
				? moment(endDate, format).format("YYYY")
				: "";
			let formattedClonedDate = clonedDate.format("YYYY");

			if (formattedStartDate || formattedEndDate) {
				if (formattedStartDate && formattedEndDate) {
					canChange =
						formattedClonedDate >= formattedStartDate &&
						formattedClonedDate <= formattedEndDate;
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
		changeNavYear(num) {
			if (this.canChangeNavYear(this.navDate, num, "year")) {
				this.navDate.add(num, "year");
			}
			this.$nextTick(() => {
				this.$forceUpdate();
			});
		}
	}
};
</script>
<style scoped lang="scss"></style>
