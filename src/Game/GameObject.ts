/**
 * Game/GameObject.ts
 * - ゲーム中のオブジェクト表現基底クラス
 * - Load、Updateなど共通処理をまとめておく
 */

import ThreeContext from '@/Game/ThreeContext'

export default abstract class GameObject {

	protected context: ThreeContext;

	constructor(context: ThreeContext) {
		this.context = context;
	}

	// ======================
	// 名前指定でanimationClip取得
	// - TODO: enum管理に置き換えたいところ。モデルローダ含めて設計余地あり
	protected GetAnimation(animations: THREE.AnimationClip[], name: string): THREE.AnimationClip | undefined {
		for (const clip of animations) {
			if (clip.name === name) { return clip; }
		}
	}
}
