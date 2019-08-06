<template>
	<div id="app">
		<p>ver 20190806 2224 test</p>
		<div>
			<label for="speed">speed</label>
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
		<ThreeView :speed="speed"></ThreeView>
	</div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';
import ThreeView from './components/ThreeView.vue';


@Component({
	components: {
		ThreeView,
	},
})

export default class App extends Vue {
	public speed: number = 0.02;

	public mounted() {
		// console.log(`App.vue mounted.`);
	}
}

</script>

<style>
#app {
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>