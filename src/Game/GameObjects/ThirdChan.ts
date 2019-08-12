/**
 * 三号ちゃんゲーム中挙動表現クラス
 */

import ThreeContext from '@/Game/ThreeContext'
import * as THREE from 'three';
import { Mesh, AnimationMixer } from 'three';
import GameObject from '../GameObject';

export default class ThirdChan extends GameObject {

	private mesh!: Mesh;
	private mixer!: AnimationMixer;

	constructor(context: ThreeContext) {
		super(context)
	}

	// TODO: 責務混乱してるかも。GameObjectはscene参照しないほうがよくない？
	public AddToScene() {

		// 三号ちゃんGLTF処理
		const thirdChanGlTF = this.context.loader!.loadedModels[this.context.loader!.THIRD_CHAN_KEY]

		const object = thirdChanGlTF.scene;
		object.castShadow = true; // TODO: 効かない。。

		const thirdChanMesh = thirdChanGlTF.scene.children[0] as Mesh;
		thirdChanMesh.castShadow = true; // TODO: 利かない。。

		this.mesh = thirdChanMesh;

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

		this.context.scene!.add(object);
	}

	public Animate(delta: number) {
		// キャラクタ回転テスト……効かない。おそらくメッシュはアニメーションミキサーに上書きされるのかも？
		// this.thirdChanMesh.rotation.x += 0.03;
		// this.thirdChanMesh.rotation.y += 0.03;
	}

}
