<template>
	<div class="component">
		<p>ver 20190812 1435 test</p>
		<div>
			<label for="speed">speed</label>
			<input
				v-model.number="speed"
				name="speed"
				id="speed"
				type="range"
				min="0.000"
				max="5.0"
				step="0.1"
			/>
		</div>
	</div>
</template>


<style lang="scss" scoped>
.component {

	color : #fff;

	// border : 5px solid red ;

	margin : 0.5em ;
	padding : 0.5em ;

	position : absolute ;
	top : 0.5em ;
	right : 0.5em ;

	border-radius : 0.3em ;
	background : rgba(75, 86, 246, 0.554)
}
</style>


<script lang="ts">

import { Component, PropSync, Emit, Watch, Vue } from 'vue-property-decorator';

@Component({})
export default class UI extends Vue {

	public speed: number = 0.02;

	@Watch('speed')
	@Emit('onSpeedChanged')
	private speedChanged(newSpeed: number, oldSpeed: number): number {
		return this.speed;
	}
}

</script>