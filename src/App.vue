<template>
	<div id="app">
		<datepicker
			ref="datepicker"
			v-model="date"
			:auto-show="autoShow"
			:auto-hide="autoHide"
			:trigger="trigger"
			:inline="inline"
			:container="container"
			:options="options"
		></datepicker>
	</div>
</template>

<script>
import "font-awesome/css/font-awesome.min.css";
import "@sass/app.scss";
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
				startDate: "29-03-2020",
				endDate: "28-02-2021"
			},
			container: true,
			inline: false,
			trigger: false,
			autoShow: true,
			autoHide: false,
			date: ""
		};
	},
	mounted() {},
	methods: {}
};
</script>

<style lang="scss"></style>
