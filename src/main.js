import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import "@directives/index.js";
import "@helpers/momentLocale.js";

Vue.config.productionTip = false;

new Vue({
	store,
	render: h => h(App)
}).$mount("#app");
