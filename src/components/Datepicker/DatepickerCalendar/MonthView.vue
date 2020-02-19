<template>
	<div class="">
		month view
		<button name="monthButton" @click="$emit('click:monthButton', 0)">
			2010
		</button>

		<button name="monthButton" @click="$emit('click:monthButton', 2)">
			Mar
		</button>
	</div>
</template>

<script>
export default {
	name: ""
};
</script>
<style scoped lang="scss"></style>
