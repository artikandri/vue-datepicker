const timeMixin = {
	mounted() {},
	methods: {
		timeMixin__compareStartEndDate(
			startTimestamp,
			endTimestamp,
			newDateTimestamp
		) {
			let isAvailable = true;
			if (startTimestamp || endTimestamp) {
				if (startTimestamp && endTimestamp) {
					isAvailable =
						newDateTimestamp >= startTimestamp &&
						newDateTimestamp <= endTimestamp;
				} else if (startTimestamp && !endTimestamp) {
					isAvailable = newDateTimestamp >= startTimestamp;
				} else if (!startTimestamp && endTimestamp) {
					isAvailable = newDateTimestamp <= endTimestamp;
				}
			} else {
				isAvailable = true;
			}

			return isAvailable;
		},
		timeMixin__checkDateValidity(dateString, format) {
			let result = false;
			if (dateString && format) {
				result = moment(dateString, format, true).isValid();
			}
			return result;
		},
		timeMixin__canChangeNav(date = {}, timeFormat = {}) {
			let { startDate, endDate, dateString, clonedDate } = date;
			let { format, newFormat } = timeFormat;

			// set the fallback format
			format = format || "DD/MM/YYYY";
			newFormat = newFormat || "x";

			// set timestamp
			let startTimestamp =
				startDate &&
				this.timeMixin__checkDateValidity(startDate, format)
					? moment(startDate, format).format(newFormat)
					: "";
			let endTimestamp =
				endDate && this.timeMixin__checkDateValidity(endDate, format)
					? moment(endDate, format).format(newFormat)
					: "";
			let dateStringTimestamp =
				dateString &&
				this.timeMixin__checkDateValidity(dateString, format)
					? moment(dateString, format).format(newFormat)
					: null;
			let clonedDateTimestamp = clonedDate
				? clonedDate.format(newFormat)
				: null;
			let newDateTimestamp =
				clonedDateTimestamp || dateStringTimestamp || "";

			// parse before comparison
			startTimestamp = parseInt(startTimestamp);
			endTimestamp = parseInt(endTimestamp);
			newDateTimestamp = parseInt(newDateTimestamp);

			// compare
			let canChange = this.timeMixin__compareStartEndDate(
				startTimestamp,
				endTimestamp,
				newDateTimestamp
			);
			return canChange;
		}
	}
};

export default timeMixin;
