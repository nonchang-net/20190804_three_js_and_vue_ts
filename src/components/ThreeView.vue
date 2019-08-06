<template>
	<canvas id="canvas" width="600" height="400"></canvas>
</template>


<style></style>

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
import { WebGLRenderer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';



@Component
export default class ThreeView extends Vue {

	@Prop()
	public speed: number = 0.02;

	private renderer: any; // TODO: 型指定するとコンストラクタで初期化しろと怒られる。修正方法は？

	private scene = new THREE.Scene();
	private camera = new THREE.PerspectiveCamera(75, 600 / 400, 0.1, 1000);
	private light = new THREE.DirectionalLight(0xffffff);

	private cube: THREE.Mesh | null = null;

	public mounted() {

		// console.log(`ThreeView.vue mounted ${123}`);

		const $canvas = document.getElementById('canvas') as HTMLCanvasElement;
		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			canvas: $canvas,
		});

		this.camera.position.set(0, 0, 2);
		this.light.position.set(0, 0, 10);
		this.scene.add(this.light);

		// キューブ追加
		const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
		const material = new THREE.MeshNormalMaterial();
		this.cube = new THREE.Mesh(geometry, material);
		this.scene.add(this.cube);

		// gltf追加
		const loader = new GLTFLoader();
		loader.load(
			'./gltfs/third-chan_ver20190729-onemesh.gltf',
			(gltf) => {
				const object = gltf.scene;
				this.scene.add(object);
			},
			(xhr) => {
				console.log(`progress: ${Math.floor(xhr.loaded / xhr.total * 100)}%`);
			},
			(error) => {
				console.error(`error : `, error);
			},
		);

		this.animate();
	}

	private animate() {
		requestAnimationFrame(this.animate);

		this.cube!.rotation.x += this.speed;
		this.cube!.rotation.y += this.speed;

		this.renderer.render(this.scene, this.camera);
	}

}
</script>