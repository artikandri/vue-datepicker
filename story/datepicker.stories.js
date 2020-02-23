import Vue from "vue";

import Datepicker from "@components/Datepicker.vue";

Vue.component("Datepicker", Datepicker);
export default {
	title: "Task",
	// Our exports that end in "Data" are not stories.
	excludeStories: /.*Data$/
};
// export const actionsData = {
//   onPinTask: action('onPinTask'),
//   onArchiveTask: action('onArchiveTask'),
// };

// export const taskData = {
//   id: '1',
//   title: 'Test Task',
//   state: 'Task_INBOX',
//   updated_at: new Date(2019, 0, 1, 9, 0),
// };

const datepickerTemplate = `<datepicker v-model="date" />`;

// default task state
export const Default = () => ({
	components: { Datepicker },
	template: datepickerTemplate,
	data() {
		return {
			date: ""
		};
	}
});

// // pinned task state
// export const Pinned = () => ({
//   components: { Task },
//   template: taskTemplate,
//   props: {
//     task: {
//       default: () => ({
//         ...taskData,
//         state: 'TASK_PINNED',
//       }),
//     },
//   },
//   methods: actionsData,
// });
// // archived task state
// export const Archived = () => ({
//   components: { Task },
//   template: taskTemplate,
//   props: {
//     task: {
//       default: {
//         ...taskData,
//         state: 'TASK_ARCHIVED',
//       },
//     },
//   },
//   methods: actionsData,
// });
