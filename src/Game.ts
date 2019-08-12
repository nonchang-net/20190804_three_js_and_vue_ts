/**
 * Game.ts
 * - Game本体の管理
 */

import * as THREE from 'three';
import ThreeContext from './Game/ThreeContext'
import Loader from './Game/Loader'
import Background from './Game/GameObjects/Background';
import Lights from './Game/GameObjects/Lights';
import ThirdChan from './Game/GameObjects/ThirdChan';
import Blocks from './Game/GameObjects/Blocks';
import Camera from './Game/GameObjects/Camera';

export default class Game {

	private scene = new THREE.Scene();
	private clock = new THREE.Clock();

	// GameObjects
	private background!: Background
	private lights!: Lights
	private thirdChan!: ThirdChan
	private blocks!: Blocks
	private camera!: Camera

	private frameSkipCount: number = 0;

	public async InitializeAsync(
		wrapperElement: HTMLElement,
		canvasElement: HTMLCanvasElement,
	) {

		const newLoader = new Loader();
		await newLoader.LoadAsync()

		const context: ThreeContext = {
			game: this,
			scene: this.scene,
			loader: newLoader,
		}

		this.camera = new Camera(context, wrapperElement, canvasElement)

		this.lights = new Lights(context)
		this.lights.AddToScene()

		this.background = new Background(context)
		this.background.AddToScene()

		this.thirdChan = new ThirdChan(context)
		this.thirdChan.AddToScene()

		this.blocks = new Blocks(context)
		this.blocks.AddToScene()

		// アニメーション開始
		this.animate();
	}

	// ======================
	// 更新、レンダリング
	private animate() {
		requestAnimationFrame(() => { this.animate(); });

		// フレームスキップ
		// 60fpsにするほどのゲームではないので1/2間引く
		this.frameSkipCount++;
		if (this.frameSkipCount % 2 === 0) {
			return;
		}

		const delta = this.clock.getDelta()

		// オブジェクト更新
		// TODO: 管理リスト化
		this.blocks.Animate(delta)
		this.thirdChan.Animate(delta);

		// レンダリング
		this.camera.Render()
	}
}
