<template>
	<div class="component">
		<div>
			<label for="speed">Test1</label>
			<input
				v-model.number="speed"
				name="speed"
				id="speed"
				type="range"
				min="0.000"
				max="0.1"
				step="0.005"
			/>
		</div>
	</div>
</template>


<style lang="scss" scoped>
.component {

	color : #fff;

	// border : 5px solid red ;

	margin : 1em ;
	padding : 1em ;

	position : absolute ;
	top : 1em ;
	right : 1em ;

	border-radius : 0.5em ;
	background : rgba(75, 86, 246, 0.554)
}
</style>


<script lang="ts">

import { Component, PropSync, Emit, Watch, Vue } from 'vue-property-decorator';

@Component({})
export default class Test1 extends Vue {

	@PropSync('syncedSpeed', {type: Number})
	private speed!: number;

}

</script>