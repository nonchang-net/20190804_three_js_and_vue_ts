/**
 * 三号ちゃんゲーム中挙動表現クラス
 */

import * as THREE from 'three';
import { AnimationMixer, Mesh, Group, AnimationClip } from 'three';
import GameObject from '../GameObject';
import Utils from '@/Common/Utils';

export default class ThirdChan extends GameObject {

	public isJump = false;

	private base: Group = new Group()
	private mesh!: Mesh;
	private mixer!: AnimationMixer;

	private idleClip?: AnimationClip;
	private jumpClip?: AnimationClip;


	// TODO: 責務混乱してるかも。GameObjectはscene参照しないほうがよくない？
	public Create(): Group {

		// 三号ちゃんGLTF処理
		const thirdChanGlTF = this.context.loader!.loadedModels[this.context.loader!.THIRD_CHAN_KEY]

		const object = thirdChanGlTF.scene;

		// object.position.set(0, 0.5, 0)

		// gltf全体で castShadow を有効にする
		thirdChanGlTF.scene.traverse( ( node ) => {
				if ( node instanceof THREE.Mesh ) { node.castShadow = true; }
		} );

		const thirdChanMesh = thirdChanGlTF.scene.children[0] as Mesh;
		this.mesh = thirdChanMesh;

		this.mixer = new THREE.AnimationMixer(thirdChanGlTF.scene)
		// console.log(gltf.animations)
		this.idleClip = this.GetAnimation( thirdChanGlTF.animations, 'Idle' )

		if (this.idleClip) {
			const action = this.mixer.clipAction(this.idleClip);
			// action.setLoop(THREE.LoopOnce, 99999);
			action.play();
		} else {
			console.error(`clip "Idle" not found...`)
		}

		this.jumpClip = this.GetAnimation( thirdChanGlTF.animations, 'Jump' )
		if (!this.jumpClip) {
			console.error(`clip "Jump" not found...`)
		}

		// 全部混ぜるテスト
		// for (let i = 0; i < gltf.animations.length; i ++ ) {
		// 	this.mixer.clipAction( gltf.animations[ i ] ).play();
		// }

		this.base.add(object);

		return this.base;

		// this.context.scene!.add(object);
	}

	public Animate(delta: number) {

		// アニメーションミキサー更新
		if ( this.mixer ) {
			this.mixer.update(delta)
		}

		// キャラクタ回転テスト……効かない。おそらくメッシュはアニメーションミキサーに上書きされるのかも？
		// this.thirdChanMesh.rotation.x += 0.03;
		// this.thirdChanMesh.rotation.y += 0.03;
	}

	public async Jump() {

		if (this.isJump) {
			return;
		}

		this.mixer.stopAllAction()
		const action = this.mixer.clipAction(this.jumpClip!)
		action.setLoop(THREE.LoopOnce, 1)

		// console.log(`jump: duration ${this.jumpClip!.duration}`);
		action.play()
		this.isJump = true;

		await Utils.Sleep(this.jumpClip!.duration * 1000)
		// console.log(`jump finished!`)
		this.isJump = false;

		const idleAction = this.mixer.clipAction(this.idleClip!);
		idleAction.play()
	}

	// DEBUG: ダメージ表現テスト
	public TEST_drop() {
		// this.mesh.material.color.set(0xff0000);
		this.base.position.y = -0.5;
		// this.base.scale.y = -1;
	}

	// DEBUG: 戻す
	public TEST_normal() {
		this.base.position.y = 0;
		// this.base.scale.y = 1;
	}

}
