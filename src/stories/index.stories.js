/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from "@storybook/vue";
import { action } from "@storybook/addon-actions";
import Datepicker from "@components/Datepicker.vue";

storiesOf("Datepicker", module)
  .addParameters({ component: Datepicker })
  .add("Default Datepicker (Popover mode)", () => ({
    components: { Datepicker },
    data() {
      return {
        date: ""
      };
    },
    template: '<datepicker v-model="date" />'
  }))
  .add("Default Datepicker (inline mode)", () => ({
    components: { Datepicker },
    data() {
      return {
        date: ""
      };
    },
    template: '<datepicker v-model="date" :inline="true" :container="true" />'
  }))
  .add("Default Datepicker (trigger mode)", () => ({
    components: { Datepicker },
    template: `
      <div class="datepicker-example">
        <div class="input-group is-append">
          <datepicker
            ref="datepicker"
            v-model="date"
            :trigger="true"
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
    `,
    data() {
      return {
        date: ""
      };
    },
    methods: {
      toggleDatepickerPopup() {
        if (this.$refs.datepicker) {
          this.$refs.datepicker.togglePopover();
        }
      }
    }
  }))
  .add("Default Datepicker (Popover mode with autoHide)", () => ({
    components: { Datepicker },
    data() {
      return {
        date: ""
      };
    },
    template: '<datepicker v-model="date" :auto-hide="true" />'
  }))
  .add("Default Datepicker (Popover mode with autoPick)", () => ({
    components: { Datepicker },
    data() {
      return {
        date: ""
      };
    },
    template: '<datepicker v-model="date" :auto-pick="true" />'
  }))
  .add("Default Datepicker (Popover mode with predefined value)", () => ({
    components: { Datepicker },
    data() {
      return {
        date: "10/10/2020"
      };
    },
    template: '<datepicker v-model="date" :container="true" />'
  }))
  .add(
    "Default Datepicker (Popover mode with predefined options: startDate, endDate and format)",
    () => ({
      components: { Datepicker },
      data() {
        return {
          date: "",
          options: {
            startDate: "02-02-2009",
            endDate: "29-03-2020",
            format: "DD-MM-YYYY"
          }
        };
      },
      template: '<datepicker v-model="date" :options="options" />'
    })
  )
  .add(
    "Default Datepicker (Popover mode with predefined options: language)",
    () => ({
      components: { Datepicker },
      data() {
        return {
          date: "",
          options: {
            language: "id"
          }
        };
      },
      template: '<datepicker v-model="date" :options="options" />'
    })
  )
  .add(
    "Default Datepicker (Popover mode with predefined options: startView 0 (year view first))",
    () => ({
      components: { Datepicker },
      data() {
        return {
          date: "",
          options: {
            startView: 2
          }
        };
      },
      template: '<datepicker v-model="date" :options="options" />'
    })
  )
  .add(
    "Default Datepicker (Popover mode with predefined options: zIndex and offset)",
    () => ({
      components: { Datepicker },
      data() {
        return {
          date: "",
          options: {
            offset: 40,
            zIndex: 1000
          }
        };
      },
      template: '<datepicker v-model="date" :options="options" />'
    })
  );
