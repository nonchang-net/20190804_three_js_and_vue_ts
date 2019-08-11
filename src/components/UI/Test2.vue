<template>
	<div class="component">
		<div>
			<label for="speed">Test2</label>
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

	color : #fcf;

	// border : 5px solid red ;

	margin : 1em ;
	padding : 1em ;

	position : absolute ;
	bottom : 1em ;
	left : 1em ;

	border-radius : 0.5em ;
	background : rgba(75, 86, 246, 0.554)
}
</style>


<script lang="ts">

/**
 * Test2.vue
 * - Test2.vueの成果を受けて、続けてApp.vueのローカル変数削除方法を調査
 */

import { Component, PropSync, Emit, Watch, Vue } from 'vue-property-decorator';

@Component({})
export default class Test2 extends Vue {

	@PropSync('syncedSpeed', {type: Number})
	private speed!: number;

}

</script>