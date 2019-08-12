/**
 * Game/View.ts
 * GameのView
 */

import * as THREE from 'three';
import { Geometry, Mesh, AnimationMixer } from 'three';
import Loader from './Loader'

export default class View {

	private readonly FIELD_OF_VIEW: number = 30;

	// 3DViewのアスペクト比率をコントロールするため、canvasをwrapperで囲む仕様
	// - wrapperのCSS定義は利用側の責務とする
	private wrapperElement!: HTMLElement;
	private canvasElement!: HTMLCanvasElement;

	private renderer!: THREE.WebGLRenderer;

	// computed
	private get viewWidth(): number {
		return this.wrapperElement.clientWidth;
	}
	private get viewHeight(): number {
		return this.wrapperElement.clientHeight;
	}
	public get Camera(): THREE.Camera {
		return this.camera;
	}

	// Three.js
	private scene = new THREE.Scene();
	private camera = new THREE.PerspectiveCamera();

	private mixer!: AnimationMixer;
	private clock = new THREE.Clock();

	public get Clock(): THREE.Clock {
		return this.clock;
	}
	public get Mixer(): THREE.AnimationMixer {
		return this.mixer;
	}

	// ローダクラス
	private loader: Loader = new Loader();


	// ======================
	// 非同期初期化
	public async InitializeAsync(
		wrapperElement: HTMLElement,
		canvasElement: HTMLCanvasElement,
	) {

		this.wrapperElement = wrapperElement;
		this.canvasElement = canvasElement;

		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			canvas: this.canvasElement,
		});

		// レンダラー：シャドウを有効にする
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		// カメラ設定など初期化
		this.SetDevicePixelRatio();
		this.UpdateCamera();

		// ウィンドウリサイズイベント登録
		window.addEventListener('resize', () => {
			this.UpdateCamera()
		})

		// glTF用? ガンマ出力を有効にしないと暗くなる
		this.renderer.gammaOutput = true;

		// 環境光追加
		const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.8);
		this.scene.add(ambientLight);

		// 平行光源追加
		const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
		directionalLight.position.set(5, 10, 5);

		directionalLight.castShadow = true;
		directionalLight.shadow.mapSize.width = 2048;
		directionalLight.shadow.mapSize.height = 2048;
		directionalLight.shadow.camera.near = 0.1
		directionalLight.shadow.camera.far = 2000

		this.scene.add(directionalLight);

		// DEBUG: ライトシャドウのカメラヘルパー追加
		// const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
		// this.scene.add( helper );


		await this.loader.LoadAsync();
		this.loader.loadedTextures[this.loader.BACKGROUND_KEY].mapping = THREE.UVMapping;
		this.scene.background = this.loader.loadedTextures[this.loader.BACKGROUND_KEY];
		// IBL設定テスト中
		// 参考: https://github.com/mrdoob/three.js/blob/master/examples/webgl_materials_cubemap_dynamic.html
		// scene.background = new CubemapGenerator(renderer)
		// 	.fromEquirectangular(texture, {
		// 		resolution: 1024,
		// 		generateMipmaps: true,
		// 		minFilter: THREE.LinearMipmapLinearFilter,
		// 		magFilter: THREE.LinearFilter
		// 	})
		// ;


		// 三号ちゃんGLTF処理
		const thirdChanGlTF = this.loader.loadedModels[this.loader.THIRD_CHAN_KEY]

		const object = thirdChanGlTF.scene;
		object.castShadow = true; // TODO: 効かない。。

		const mesh = thirdChanGlTF.scene.children[0] as Mesh;
		mesh.castShadow = true; // TODO: 利かない。。

		this.mixer = new THREE.AnimationMixer(thirdChanGlTF.scene)
		// console.log(gltf.animations)
		const clip = this.GetAnimation( thirdChanGlTF.animations, 'Idle' )

		if (clip) {
			const action = this.mixer.clipAction(clip);
			// action.setLoop(THREE.LoopOnce, 99999);
			action.play();
		} else {
			console.error(`clip "Idle" not found...`)
		}

		// 全部混ぜるテスト
		// for (let i = 0; i < gltf.animations.length; i ++ ) {
		// 	this.mixer.clipAction( gltf.animations[ i ] ).play();
		// }

		this.scene.add(object);


		// GreenCube処理
		const greenBlockGlTF = this.loader.loadedModels[this.loader.GREEN_BLOCK_KEY]

		// 要素一つだけのgltfなのでchildren0番目をMeshとして取得
		const originalMesh = greenBlockGlTF.scene.children[0] as Mesh;

		// cloneでサンプル土台を配置していく
		// const meshes: Mesh[] = [];

		// z方向にn個羅列
		for (let i: number = -10; i < 30; i++) {
			const copiedMesh = originalMesh.clone()
			// meshes.push(mesh);
			copiedMesh.position.set(0, -0.5, -1 * i)
			copiedMesh.receiveShadow = true;
			// mesh.castShadow = true;
			this.scene.add(copiedMesh);
		}


		// カメラ設定

		// Blenderと合わせる手順メモ
		// - Lens UnitがField of Viewになっていることを確認、Three側のFOVも同じにする
		// - xはそのまま入れる
		// - yは逆数にしてzに入れる
		// - zはそのままyに入れる
		this.Camera.position.set(-2, 2.5, 7);

		// Blenderと合わせる手順メモ
		// - xから90引く
		// - yは逆数をzに入れる
		// - zはyに入れる
		this.Camera.rotation.set(
			THREE.Math.degToRad(-20),
			THREE.Math.degToRad(-17),
			THREE.Math.degToRad(0),
		);

		// アニメーション開始
		this.animate();

	}

	// ======================
	// アニメーション
	public animate() {
		requestAnimationFrame(() => { this.animate(); });

		if ( this.Mixer ) {
			this.Mixer.update(this.Clock.getDelta())
		}

		// this.RotateCube(this.speed);
		// this.Camera.rotation.y += this.speed
		this.Render();
	}

	// ======================
	// レンダリング
	// - 検討中: 利用側requestAnimationFrameで呼び出してるけど、こっちに移した方が良いかも
	public Render() {
		this.renderer.render(this.scene, this.camera);
	}

	// ======================
	// 名前指定でanimationClip取得
	// - TODO: enum管理に置き換えたいところ。モデルローダ含めて設計余地あり
	private GetAnimation(animations: THREE.AnimationClip[], name: string): THREE.AnimationClip | undefined {
		for (const clip of animations) {
			if (clip.name === name) { return clip; }
		}
	}

	// ======================
	// retinaなどのレンダラー解像度設定
	private SetDevicePixelRatio() {

		// this.renderer.setPixelRatio(0.25); // 1未満だとぼやける。低負荷で確認したいときなどに。

		// 多分本番はこれだけで良さそう。retinaでくっきり
		this.renderer.setPixelRatio(window.devicePixelRatio);

		// OLD:
		// this.renderer.setPixelRatio(1); //retina無効状態
		// this.renderer.setPixelRatio(2); //倍解像度(非retinaで綺麗)
		// this.renderer.setPixelRatio(window.devicePixelRatio); //retinaなどではくっきり高画質

		// 以上の結果をもとに、一旦以下の案。（重いので開発中は保留）
		// - 非retinaでのPCではアンチエイリアスを期待して倍解像度（？）
		// - retinaではdevice解像度」を適用

		// if (window.devicePixelRatio <= 1) {
		// 	this.renderer.setPixelRatio(2); // 倍解像度(非retinaで綺麗)
		// } else {
			// this.renderer.setPixelRatio(window.devicePixelRatio); // retinaなどではくっきり高画質
		// }
	}

	// ======================
	// カメラ更新
	// - note: 初期化時とブラウザサイズが変わった時などにレイアウト追従
	private UpdateCamera() {

		this.camera.near = 1;
		this.camera.far = 10000;

		this.renderer.setSize(this.viewWidth, this.viewHeight);
		this.camera.aspect = this.viewWidth / this.viewHeight

		// TODO: カメラ維持方向はコンストラクタ設定で切り替えられるようにする
		// this.UpdateCameraAspectForWidthMatch(); // width match
		this.UpdateCameraAspectForHeightMatch(); // height match

		this.camera.updateProjectionMatrix();
	}

	// ======================
	// ビュー幅維持のカメラ設定
	private UpdateCameraAspectForWidthMatch() {
		// note: 逆アスペクトをfovに乗算することで、画面幅維持した画角にする
		this.camera.fov = this.FIELD_OF_VIEW * (this.viewHeight / this.viewWidth)
	}

	// ======================
	// ビュー高さ維持のカメラ設定
	private UpdateCameraAspectForHeightMatch() {
		this.camera.fov = this.FIELD_OF_VIEW
	}

}
