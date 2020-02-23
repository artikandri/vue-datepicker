<template>
	<div id="app" class="datepicker-documentation">
		<div class="datepicker-example">
			<div class="input-group">
				<datepicker ref="datepicker" v-model="date"></datepicker>
			</div>
		</div>
		<div class="datepicker-example">
			<div class="input-group">
				<datepicker
					ref="datepicker"
					v-model="date"
					:container="true"
					:inline="true"
				></datepicker>
			</div>
		</div>
	</div>
</template>

<script>
import Datepicker from "@components/Datepicker.vue";

export default {
	name: "App",
	components: {
		Datepicker
	},
	data() {
		return {
			options: {
				language: "id",
				format: "DD-MM-YYYY",
				startDate: "29-01-2020",
				endDate: "28-02-2021"
			},
			container: false,
			inline: false,
			trigger: false,
			autoShow: true,
			autoHide: false,
			yearFirst: false,
			date: ""
		};
	},
	mounted() {},
	methods: {}
};
</script>

<style lang="scss"></style>
