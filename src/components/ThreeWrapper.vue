<template>
	<div class="wrapper" id="wrapper">
		<canvas id="canvas" />
	</div>
</template>


<style lang="scss" scoped>

.wrapper{
	position : absolute;
	width : 100%;
	height : 100%;
	left : 0 ;
	top : 0 ;

}

canvas{
	position: absolute;
	width: 100%;
	height : 100%;
	left : 0 ;
	top : 0 ;
}

</style>

<script lang="ts">
/**
 * ThreeWrapper.vue
 * ゲームビューのvue側ラッパ
 *
 * ## 検討中のメモ
 *
 * - ゲーム表現はTHREEと密着しているので、全部ThreeUtil.tsに任せる
 * - TODO: このコンポーネントはゲームの状況に応じてUIイベントをemitするのみ
 * - VueはDOM要素の単位でコンポーネント化する設計なので、Three.js管理下の3D表示要素はコンポーネント化できない
 * - VueはHTML UI部品の実装に利用する方針。
 * - このクラスがVueイベントの橋渡しになると考える
 * - Three.jsとゲーム実装部分はPure TypeScriptクラスで実装する
 */
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import Game from '../Game';

@Component
export default class ThreeWrapper extends Vue {

	@Prop() public speed: number = 0.02;

	private game!: Game;

	public mounted() {
		// TODO: ゲーム状況変動イベントを購読し、UI変更の必要があればemitする
		this.InitializeAsync()
	}

	private async InitializeAsync() {
		// TODO: ローディング表示
		this.game = new Game();
		this.game.InitializeAsync(
			document.getElementById('wrapper') as HTMLElement,
			document.getElementById('canvas') as HTMLCanvasElement,
		)
		// TODO: ここでローディング表示を解除
	}

	// TODO: VM10102:37 [Vue warn]: Avoid mutating a prop directly since the
	// value will be overwritten whenever the parent component re-renders.
	// Instead, use a data or computed property based on the prop's value.
	// Prop being mutated: "speed"
	// @Watch('speed')
	// private OnSpeedChanged() {
	// 	// console.log(`OnSpeedChanged() ${this.speed}`);
	// 	this.game.SetSpeed(this.speed)
	// }

}
</script>