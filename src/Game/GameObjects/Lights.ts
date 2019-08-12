/**
 * ライト
 */

import * as THREE from 'three';
import GameObject from '../GameObject';

export default class Lights extends GameObject {

	// TODO: 責務混乱してるかも。GameObjectはscene参照しないほうがよくない？
	// - 多分自分のオブジェクトを公開して、利用側でAddすべき
	public AddToScene() {

		// 環境光追加
		const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.8);
		this.context.scene!.add(ambientLight);

		// ambientLight.castShadow = true; // エラー

		// 平行光源追加
		const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
		directionalLight.position.set(1, 2, 1);

		directionalLight.castShadow = true;
		directionalLight.shadow.mapSize.width = 2048;
		directionalLight.shadow.mapSize.height = 2048;
		directionalLight.shadow.camera.near = 0.01
		directionalLight.shadow.camera.far = 100

		this.context.scene!.add(directionalLight);

		// DEBUG: ライトシャドウのカメラヘルパー追加
		// const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
		// this.context.scene!.add( helper );
	}

}
