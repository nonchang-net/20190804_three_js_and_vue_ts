/**
 * カメラとレンダラ周り
 * - とりあえずくくり出しただけになっちゃったけど、良い名前が思いつかないので保留中
 * - だいたいボイラープレートコード
 */

import * as THREE from 'three';
import GameObject from '../GameObject';
import ThreeContext from '../ThreeContext';

export default class Camera extends GameObject {

	private readonly FIELD_OF_VIEW: number = 30;

	private wrapperElement!: HTMLElement;
	private canvasElement!: HTMLCanvasElement;

	private camera = new THREE.PerspectiveCamera();
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


	public constructor(
		context: ThreeContext,
		wrapperElement: HTMLElement,
		canvasElement: HTMLCanvasElement,
	) {
		super(context)

		this.wrapperElement = wrapperElement;
		this.canvasElement = canvasElement

		this.renderer = new THREE.WebGLRenderer({
			antialias: false,
			canvas: this.canvasElement,
		});

		// レンダラー：シャドウを有効にする
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		// glTF用? ガンマ出力を有効にしないと暗くなる
		this.renderer.gammaOutput = true;

		// カメラ設定など初期化
		this.SetDevicePixelRatio();
		this.UpdateCamera();
		this.SetCameraLocRot()

		// ウィンドウリサイズイベント登録
		window.addEventListener('resize', () => {
			this.UpdateCamera()
		})
	}

	// レンダリング
	public Render() {
		this.renderer.render(this.context.scene!, this.camera);
	}

	private SetCameraLocRot() {
		// カメラ設定
		// - とりあえず手動でBlender上のloc/rotを適用

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
		this.camera.far = 60;

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
