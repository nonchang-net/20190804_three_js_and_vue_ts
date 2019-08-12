/**
 * 床ブロック表現
 */
import * as THREE from 'three';
import { Mesh, Group } from 'three';
import GameObject from '../GameObject';

export default class Blocks extends GameObject {

	public speed = 3.2;

	public base: Group = new Group()

	private readonly FIRST_POS = -10;
	private readonly LAST_POS = 30;
	private readonly CUBE_SIZE = 1.0

	private cubes: Mesh[] = [];

	private overPosCache = -1
	private respawnDelta = -1

	// ======================
	// 生成
	public Create(): Group {

		this.overPosCache = (this.LAST_POS + 1) * this.CUBE_SIZE * -1
		const respawnPos = this.FIRST_POS * this.CUBE_SIZE * -1
		this.respawnDelta = respawnPos - this.overPosCache

		// console.log(this.overPosCache, respawnPos, this.respawnDelta);

		// GreenCube処理
		const greenBlockGlTF = this.context.loader!.loadedModels[this.context.loader!.GREEN_BLOCK_KEY]

		// gltf全体で receiveShadow を有効にする
		greenBlockGlTF.scene.traverse( ( node ) => {
				if ( node instanceof THREE.Mesh ) { node.receiveShadow = true; }
		} );

		// 要素一つだけのgltfなのでchildren0番目をMeshとして取得
		const originalMesh = greenBlockGlTF.scene.children[0] as Mesh;


		// cloneでサンプル土台を配置していく
		// z方向にn個羅列
		for (let i: number = this.FIRST_POS; i <= this.LAST_POS; i++) {
			const copiedMesh = originalMesh.clone()
			this.cubes.push(copiedMesh);

			// 基本位置算出
			copiedMesh.position.set(0, -0.5, -1 * i)

			// 影を落とす……必要はないはず。レンダリングが変わる？
			// copiedMesh.castShadow = true;

			if (i === this.FIRST_POS) {
				// DEBUG: 最初のやつは目印でちょっと回転させておく
				copiedMesh.rotation.y = 30
			} else if (i === this.LAST_POS) {
				// DEBUG: 最後のやつは目印でscaleさせておく
				copiedMesh.scale.set(0.5, 0.5, 0.5)
			} else {
				this.Randomize(copiedMesh)
			}

			this.base.add(copiedMesh)
		}

		return this.base
	}

	// ======================
	// アニメーション
	public Animate(delta: number) {

		for (const cube of this.cubes) {
			cube.position.z -= delta * this.speed
			// cube.rotation.y += 0.03;

			// 奥行きすぎたやつは手前にリスポーンかける
			if (cube.position.z < this.overPosCache) {
				// console.log(`respawn ${cube.position.z} to ${cube.position.z + this.respawnDelta}`);
				cube.position.z += this.respawnDelta
				this.Randomize(cube)
			}

		}
		// console.log(this.cubes[0].position);
	}

	// ======================
	// ブロックの有効・無効をランダムで切り替える
	// TODO: 実際にはゲームスピードを加味して跳べるジャンプ量以上に連続させない工夫が必要
	private Randomize(mesh: Mesh) {
		if (Math.floor(Math.random() * 5) === 0) {
			// ランダムに非表示にしておく
			mesh.position.y = 10000;
			// copiedMesh.position.y = -3;
		} else {
			mesh.position.y = -0.5;
		}
	}

}
