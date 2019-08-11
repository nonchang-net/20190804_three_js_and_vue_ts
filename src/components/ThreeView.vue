<template>
	<div class="wrapper" id="wrapper">
		<canvas id="canvas" />
	</div>
</template>


<style lang="scss" scoped>

.wrapper{
	border : 1px solid blue;
	position : absolute;
	width : 100%;
	height : 100%;
	left : 0 ;
	top : 0 ;

}

canvas{
	border : 1px solid red;
	position: absolute;
	width: 100%;
	height : 100%;
	left : 0 ;
	top : 0 ;
}

</style>

<script lang="ts">
/*

ThreeView.vue

- Three.jsを扱うビュー

## 検討中のメモ

- VueはDOM要素の単位でコンポーネント化する設計なので、Three.js管理下の3D表示要素はコンポーネント化できない

- VueはHTML UI部品の実装に利用する方針。
	- このクラスがVueイベントの橋渡しになると考える

- Three.jsとゲーム実装部分はPure TypeScriptクラスで実装することになりそう。


*/
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import ThreeUtil from '../Common/ThreeUtil/ThreeUtil';
import { WebGLRenderer } from 'three';



@Component
export default class ThreeView extends Vue {

	@Prop() public speed: number = 0.02;

	private threeUtil!: ThreeUtil;

	public mounted() {

		const wrapperElement = document.getElementById('wrapper') as HTMLElement;
		const canvasElement = document.getElementById('canvas') as HTMLCanvasElement;

		// three処理ユーティリティ初期化
		// - TODO: モデル読み込みなどを任せて、awaitで待つようにしたい
		const three = new ThreeUtil(wrapperElement, canvasElement);
		this.threeUtil = three;

		// test: cube追加
		// three.AddTestCuveToScene();

		// test: gltf追加
		three.LoadAndAddGltfTest();
		three.LoadGreenBlock();

		// カメラ設定

		// Blenderと合わせる手順メモ
		// - Lens UnitがField of Viewになっていることを確認、Three側のFOVも同じにする
		// - xはそのまま入れる
		// - yは逆数にしてzに入れる
		// - zはそのままyに入れる
		three.Camera.position.set(-2, 2.5, 7);

		// Blenderと合わせる手順メモ
		// - xから90引く
		// - yは逆数をzに入れる
		// - zはyに入れる
		three.Camera.rotation.set(
			THREE.Math.degToRad(-20),
			THREE.Math.degToRad(-17),
			THREE.Math.degToRad(0),
		);

		this.animate();
	}

	private animate() {
		requestAnimationFrame(this.animate);

		if ( this.threeUtil.Mixer ) {
			this.threeUtil.Mixer.update(this.threeUtil.Clock.getDelta())
		}

		// this.threeUtil.RotateCube(this.speed);
		// this.threeUtil.Camera.rotation.y += this.speed
		this.threeUtil.Render();
	}



}
</script>