<template>
  <div
    id="app"
    class="datepicker"
  >
    <div class="datepicker-example">
      <div class="input-group is-append">
        <datepicker
          ref="datepicker"
          v-model="date"
          :auto-show="autoShow"
          :auto-hide="autoHide"
          :trigger="trigger"
          :inline="inline"
          :container="container"
          :year-first="yearFirst"
          :options="options"
        ></datepicker>
        <div class="input-group-append">
          <button
            type="button"
            @click="toggleDatepickerPopup"
            class="btn btn-datepicker btn-primary"
          >
            <i class="fa fa-calendar"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "font-awesome/css/font-awesome.min.css";
import "@sass/app.scss";
import Datepicker from "@components/Datepicker.vue";

export default {
  name: "App",
  components: {
    Datepicker,
  },
  data() {
    return {
      options: {
        language: "id",
        format: "DD-MM-YYYY",
        startDate: "29-01-2020",
        endDate: "28-02-2021",
        weekStart: 2,
      },
      container: false,
      inline: false,
      trigger: false,
      autoShow: true,
      autoHide: false,
      yearFirst: false,
      date: "",
    };
  },
  mounted() {},
  methods: {
    toggleDatepickerPopup() {
      if (this.$refs.datepicker) {
        this.$refs.datepicker.togglePopover();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.datepicker-example {
  padding: 30px;
}
</style>
