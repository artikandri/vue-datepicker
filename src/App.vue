<template>
	<div id="app">
		<datepicker
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
			options: {},
			container: false,
			inline: false,
			trigger: true,
			autoShow: true,
			autoHide: false,
			date: "09/10/2020"
		};
	}
};
</script>

<style lang="scss"></style>
