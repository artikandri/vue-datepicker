<template>
	<div id="app">
		<datepicker v-model="date"></datepicker>
	</div>
</template>

<script>
import "line-awesome/dist/line-awesome/css/line-awesome.min.css";
import "@sass/app.scss";
import Datepicker from "@components/Datepicker.vue";

export default {
	name: "App",
	components: {
		Datepicker
	},
	data() {
		return {
			date: ""
		};
	}
};
</script>

<style lang="scss"></style>
