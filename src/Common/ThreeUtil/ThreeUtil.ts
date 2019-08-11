/**
 * ThreeUtil
 *
 * - Vueに依存しないThree.js処理ロジックまとめ
 * 		- 一旦はアプリ寄りの固有処理もここにまとめていく。
 * 		- 汎用性の考慮はYAGNIにならない程度に適当に。
 * 		- Three使ったアプリの新規作成時に、ボイラープレートになりがちなアスペクト処理やglTF周りの実装を丸っと持っていける状態が理想。
 *
 * - Three.js自体にない汎用的な処理をまとめるイメージ
 * 		- なのでよく調べたらすでにあった、とか新しいバージョンで公式実装された、みたいなこともあるかも。
 * 		- その場合は都度削除・置き換えていくこと
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { CubemapGenerator } from 'three/examples/jsm/loaders/EquirectangularToCubeGenerator.js';
import { Geometry, Mesh } from 'three';

export default class ThreeUtil {

	private readonly FIELD_OF_VIEW: number = 30;

	// 3DViewのアスペクト比率をコントロールするため、canvasをwrapperで囲む仕様
	// - wrapperのCSS定義は利用側の責務とする
	private wrapperElement: HTMLElement;
	private canvasElement: HTMLCanvasElement;

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

	// ライト
	// TODO: 利用側設定に汎用化したいところ。IBL試す
	private light = new THREE.DirectionalLight(0xffffff);

	// キューブインスタンス
	// TODO: ゲーム中に使われるオブジェクトの管理は利用側にくくり出したい。辞書管理か何か考える
	private cube!: THREE.Mesh;

	// private aspectRatio: AspectRatioUtil = new AspectRatioUtil();

	private gltfLoader: GLTFLoader;


	// ======================
	// コンストラクタ
	// - TODO: もう少し汎用化。やりすぎは注意
	public constructor(wrapperElement: HTMLElement, canvasElement: HTMLCanvasElement) {

		this.wrapperElement = wrapperElement;
		this.canvasElement = canvasElement;

		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			canvas: this.canvasElement,
		});

		// カメラ設定など初期化
		this.SetDevicePixelRatio();
		this.InititalizeCamera();
		this.UpdateCamera();

		// ウィンドウリサイズイベント登録
		window.addEventListener('resize', () => {
			this.UpdateCamera()
		})

		// glTF用? ガンマ出力を有効にしないと暗くなる
		this.renderer.gammaOutput = true;

		// gltfLoader初期化
		this.gltfLoader = new GLTFLoader();

		// ライト初期化、シーンに追加
		this.light.position.set(0, 0, 10);
		this.light.rotation.set(0, 45, 20); // 効いてない？
		this.scene.add(this.light);

		// IBL設定テスト中
		// 参考: https://github.com/mrdoob/three.js/blob/master/examples/webgl_materials_cubemap_dynamic.html
		const scene = this.scene
		// const renderer = this.renderer
		const textureLoader = new THREE.TextureLoader();
		textureLoader.load(
			'./ibl/simple_equirecutangler.png',
			(texture: THREE.Texture) => {
				texture.mapping = THREE.UVMapping;
				scene.background = texture;
				// scene.background = new CubemapGenerator(renderer)
				// 	.fromEquirectangular(texture, {
				// 		resolution: 1024,
				// 		generateMipmaps: true,
				// 		minFilter: THREE.LinearMipmapLinearFilter,
				// 		magFilter: THREE.LinearFilter
				// 	})
				// ;
			},
		);


	}


	// ======================
	// レンダリング
	// - 検討中: 利用側requestAnimationFrameで呼び出してるけど、こっちに移した方が良いかも
	public Render() {
		this.renderer.render(this.scene, this.camera);
	}

	// ======================
	// キューブ追加テスト
	// - TODO: オブジェクト管理方法の検討
	public AddTestCuveToScene() {
		const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
		const material = new THREE.MeshNormalMaterial();
		this.cube = new THREE.Mesh(geometry, material);
		this.scene.add(this.cube);
	}

	// ======================
	// キューブ回転テスト
	// - TODO: オブジェクト管理方法の検討
	public RotateCube( speed: number) {
		this.cube.rotation.x += speed;
		this.cube.rotation.y += speed;
	}

	// ======================
	// glTF読み込みテスト
	// - TODO: promiseでくくってawait呼び出しできるようにしたい
	// - TODO: 複数モデルのローダとして汎用化したい。またlocalStorageにキャッシュしたい
	public LoadAndAddGltfTest() {
		this.gltfLoader.load(
			'./gltfs/third-chan_ver20190811-onemesh.gltf',
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
	}

	public LoadGreenBlock() {
		this.gltfLoader.load(
			'./gltfs/green-block.glb',
			(gltf) => {
				const object = gltf.scene;
				object.position.set(0, -0.5, 0)
				this.scene.add(object);

				// フロック二つ目を作る
				const originalMesh = gltf.scene.children[0] as Mesh;

				const mesh = originalMesh.clone();
				mesh.position.set(-1, -0.5, 0)
				this.scene.add(mesh);

				const mesh3 = originalMesh.clone();
				mesh3.position.set(0, -0.5, 2)
				this.scene.add(mesh3);


				// const block2 = gltf.scene
				// block2.position.set(0, -0.5, -1)
				// this.scene.add(block2);
			},
			(xhr) => {
				console.log(`progress: ${Math.floor(xhr.loaded / xhr.total * 100)}%`);
			},
			(error) => {
				console.error(`error : `, error);
			},
		);
	}

	// ======================
	// retinaなどのレンダラー解像度設定
	private SetDevicePixelRatio() {

		this.renderer.setPixelRatio(0.25); // 1未満だとぼやける。低負荷で確認したいときなどに。

		// 多分本番はこれだけで良さそう。retinaでくっきり
		// this.renderer.setPixelRatio(window.devicePixelRatio);

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
	// カメラ初期化
	// - TODO: 縦横比率維持設定のロジックを考える
	// - TODO: position.setは利用側でやるべき処理だよなぁ……。
	private InititalizeCamera() {
		this.camera.near = 1;
		this.camera.far = 10000;
		this.camera.position.set(0, 0, +1000)
	}

	// ======================
	// カメラ更新
	// - note: 初期化時とブラウザサイズが変わった時などにレイアウト追従
	private UpdateCamera() {

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

// class ThreeContext {

// }

// class AspectRatioUtil {

// }

// class GeometoryUtil {

// }
