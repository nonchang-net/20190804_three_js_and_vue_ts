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

export default class ThreeUtil {

	private readonly VIEW_SIZE: {height: number, width: number} = {
		height: 192,
		width: 108,
	};

	private readonly FIELD_OF_VIEW: number = 75;

	// 3DViewのアスペクト比率をコントロールするため、canvasをwrapperで囲む仕様
	// - wrapperのCSS定義は利用側の責務とする
	private wrapperElement!: HTMLElement;
	private canvasElement: HTMLCanvasElement;

	private renderer!: THREE.WebGLRenderer;

	private scene = new THREE.Scene();
	private camera = new THREE.PerspectiveCamera(
		this.FIELD_OF_VIEW,
		this.VIEW_SIZE.width / this.VIEW_SIZE.height,
		0.1,
		1000,
	);
	private light = new THREE.DirectionalLight(0xffffff);

	// キューブインスタンス
	// TODO: ゲーム中に使われるオブジェクトの管理は利用側にくくり出したい。辞書管理か何か考える
	private cube!: THREE.Mesh;

	// private aspectRatio: AspectRatioUtil = new AspectRatioUtil();




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

		this.renderer.gammaOutput = true;

		this.camera.position.set(0, 0, 2);
		this.light.position.set(0, 0, 10);
		this.scene.add(this.light);
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
	}

	// ======================
	// retinaなどのレンダラー解像度設定
	private SetDevicePixelRatio() {

		this.renderer.setPixelRatio(0.25); // 1未満だとぼやける。低負荷で確認したいときなどに。
		// this.renderer.setPixelRatio(1); //retina無効状態
		// this.renderer.setPixelRatio(2); //倍解像度(非retinaで綺麗)
		// this.renderer.setPixelRatio(window.devicePixelRatio); //retinaなどではくっきり高画質

		// 以上の結果をもとに、以下が最終案。（重いので開発中は保留）
		// - 非retinaでのPCではアンチエイリアスを期待して倍解像度
		// - retinaではdevice解像度」を適用

		// if (window.devicePixelRatio <= 1) {
		// 	this.renderer.setPixelRatio(2); // 倍解像度(非retinaで綺麗)
		// } else {
		// 	this.renderer.setPixelRatio(window.devicePixelRatio); // retinaなどではくっきり高画質
		// }
	}

	// ======================
	// カメラ初期化
	// - TODO: 縦横比率維持設定のロジックを考える
	// - TODO: position.setは利用側だよなぁ……。
	private InititalizeCamera() {

		this.camera = new THREE.PerspectiveCamera(
			this.FIELD_OF_VIEW * (this.canvasElement.clientHeight / this.canvasElement.clientWidth),
			this.canvasElement.clientWidth / this.canvasElement.clientHeight,
			1,
			10000,
		)
		this.camera.position.set(0, 0, +1000)
	}

	// ======================
	// カメラ更新
	// - note: ブラウザサイズが変わった時などにレイアウト追従
	private UpdateCamera() {
		// サイズを取得
		// console.log(`this.uiElement.clientWidth = ${this.uiElement.clientWidth}`)
		const width = this.wrapperElement.clientWidth;
		const height = this.wrapperElement.clientHeight;

		this.renderer.setSize(width, height);

		// カメラのアスペクト比を正す
		this.camera.aspect = width / height
		// this.camera.aspect = width / height * 3.2 // TODO: 横壁を見せたい場合にこんくらいまで広げると見えるという例。調整中。

		// note: 逆アスペクトをfovに乗算することで、画面横幅サイズを維持した画角になる（要検証）
		this.camera.fov = this.FIELD_OF_VIEW * (height / width) // * 0.8

		this.camera.updateProjectionMatrix();
	}


}

// class ThreeContext {

// }

// class AspectRatioUtil {

// }

// class GeometoryUtil {

// }
