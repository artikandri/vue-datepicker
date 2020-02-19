<template>
	<div id="app">
		<datepicker v-model="date"></datepicker>
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
			date: "09/10/2020"
		};
	}
};
</script>

<style lang="scss"></style>
