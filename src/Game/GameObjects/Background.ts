/**
 * 背景
 */

import * as THREE from 'three';
import GameObject from '../GameObject';

export default class Background extends GameObject {

	// TODO: 責務混乱してるかも。GameObjectはscene参照しないほうがよくない？
	// - 多分自分のオブジェクトを公開して、利用側でAddすべき
	public AddToScene() {

		this.context.loader!.loadedTextures[this.context.loader!.BACKGROUND_KEY].mapping = THREE.UVMapping;
		this.context.scene!.background = this.context.loader!.loadedTextures[this.context.loader!.BACKGROUND_KEY];
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
	}

}
