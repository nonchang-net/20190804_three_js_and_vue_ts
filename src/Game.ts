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

	private raycaster = new THREE.Raycaster();

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


		wrapperElement.addEventListener('touchstart', (event) => { this.Tap(event) }, { passive: false });
		wrapperElement.addEventListener('mousedown', (event) => { this.Tap(event) }, { passive: false })

		this.lights = new Lights(context)
		this.lights.AddToScene()

		this.background = new Background(context)
		this.background.AddToScene()

		this.thirdChan = new ThirdChan(context)
		const thirdChanBase = this.thirdChan.Create()
		this.scene.add(thirdChanBase)

		this.blocks = new Blocks(context)
		const blockBase = this.blocks.Create()
		this.scene.add(blockBase)

		// アニメーション開始
		this.animate();
	}

	public Tap(event: Event | MouseEvent | TouchEvent) {
		// console.log(`tapped!`);
		this.thirdChan.Jump();
	}

	// DEBUG: スピード変更
	public SetSpeed(speed: number) {
		this.blocks.speed = speed;
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
		this.blocks.Animate(delta)
		this.thirdChan.Animate(delta);


		// 下方向にレイキャスト
		this.raycaster.set(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -1, 0))
		// console.log(this.raycaster.intersectObjects(this.blocks.base.children).length);
		if (this.raycaster.intersectObjects(this.blocks.base.children).length === 0
			&& !this.thirdChan.isJump
		) {
			// 落ちてる
			this.thirdChan.TEST_drop()
		} else {
			// 落ちてない
			this.thirdChan.TEST_normal()
		}

		// レンダリング
		this.camera.Render()
	}
}
