<template>
	<div id="app">
		<ThreeWrapper
			ref="threeWrapper"
			:speed="speed"
		/>
		<UI
			ref="ui1"
			@onSpeedChanged='onSpeedChanged($event)'
		/>
		<!--
		<Test1
			ref = "test1"
			:syncedSpeed.sync = "appSyncedSpeed"
		/>
		
		<Test2
			ref = "test2"
			:syncedSpeed.sync = "speed"
		/>
		-->

	</div>
</template>

<style lang="scss">

html, body{
	overflow: hidden;
}

*{
	margin : 0 ;
	padding : 0 ;
}

#app {

	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	position : absolute;
	width : 100%;
	height : 100%;
}
</style>

<script lang="ts">

import { Component, Ref, Watch, Prop, Vue } from 'vue-property-decorator';
import ThreeWrapper from './components/ThreeWrapper.vue';
import UI from './components/UI.vue';
import Test1 from './components/UI/Test1.vue';
import Test2 from './components/UI/Test2.vue';


@Component({
	components: {
		ThreeWrapper,
		UI,
		Test1,
		Test2,
	},
})

export default class App extends Vue {

	public speed: number = 0.02;

	public appSyncedSpeed: number = 0.05;

	@Ref() private threeWrapper!: ThreeWrapper;
	// @Ref() private ui1!: UI;
	// @Ref() private test1!: Test1;

	public mounted() {
		// 全画面アプリなのでスクロールを停止する
		// TODO: これだけだとバーのタッチ系などtouchmove依存のUI操作も全て禁止になるので個別措置など検討
		document.addEventListener('touchmove', (e) => { e.preventDefault(); }, {passive: false});
	}

	private onSpeedChanged(newSpeed: number) {
		// console.log(`App.vue: ui1: onSpeedChanged(${newSpeed})`);
		this.speed = newSpeed;
	}


	@Watch('appSyncedSpeed')
	private onSyncedSpeedChanged() {
		// console.log(`App.vue: syncedSpeed: onSyncedSpeedChanged(${this.appSyncedSpeed})`);
	}




}

</script>