/**
 * 床ブロック表現
 */
import { Mesh } from 'three';
import GameObject from '../GameObject';

export default class Blocks extends GameObject {

	private cubes: Mesh[] = [];

	public AddToScene() {

		// GreenCube処理
		const greenBlockGlTF = this.context.loader!.loadedModels[this.context.loader!.GREEN_BLOCK_KEY]

		// 要素一つだけのgltfなのでchildren0番目をMeshとして取得
		const originalMesh = greenBlockGlTF.scene.children[0] as Mesh;

		// DEBUG: これらを元にループさせる
		const firstPos = -10;
		const lastPos = 30;

		// cloneでサンプル土台を配置していく
		// z方向にn個羅列
		for (let i: number = firstPos; i <= lastPos; i++) {
			const copiedMesh = originalMesh.clone()
			this.cubes.push(copiedMesh);

			// 基本位置算出
			copiedMesh.position.set(0, -0.5, -1 * i)
			copiedMesh.receiveShadow = true;

			if (i === firstPos) {
				// DEBUG: 最初のやつは目印で回転させておく
				copiedMesh.rotation.y = 30
			} else if (i === lastPos) {
				// DEBUG: 最後のやつは目印でscaleさせておく
				copiedMesh.scale.set(0.5, 0.5, 0.5)
			} else if (Math.floor(Math.random() * 5) === 0) {
				// ランダムに非表示にしておく
				copiedMesh.position.y = 10000;
			}

			// mesh.castShadow = true;
			this.context.scene!.add(copiedMesh);
		}
	}

	public Animate(delta: number) {

		const speed = 1.2;

		// キューブを何も考えずに移動してみる
		for (const cube of this.cubes) {
			cube.position.z -= delta * speed
			// cube.rotation.y += 0.03;
		}
		// console.log(this.cubes[0].position);
	}
}
