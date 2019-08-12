/**
 * Game/Loader.ts
 * - Threeのロード処理周り管理
 * - 初期化時に読み込みが必要なセットを渡し、全て完了するまで待機する
 * - 読み込み完了後はLoader側でリソースをキャッシュ
 */
import * as THREE from 'three';

import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { CubemapGenerator } from 'three/examples/jsm/loaders/EquirectangularToCubeGenerator.js';

export default class Loader {

	// URLをキーとして扱う
	public readonly BACKGROUND_KEY = './ibl/simple_equirecutangler.png'
	public readonly THIRD_CHAN_KEY = './gltfs/third-chan_ver20190811-onemesh.gltf'
	public readonly GREEN_BLOCK_KEY = './gltfs/green-block.glb'

	public background!: THREE.Texture;

	public loadedTextures: { [index: string]: THREE.Texture } = {}
	public loadedModels: { [index: string]: GLTF } = {}

	private textureLoader = new THREE.TextureLoader()
	private gltfLoader: GLTFLoader = new GLTFLoader();

	// とりあえず立て続けにロードするテストなど
	public async LoadAsync() {
		this.loadedTextures[this.BACKGROUND_KEY] = await this.LoadTexture(this.BACKGROUND_KEY);
		this.loadedModels[this.THIRD_CHAN_KEY] = await this.LoadGlTF(this.THIRD_CHAN_KEY);
		this.loadedModels[this.GREEN_BLOCK_KEY] = await this.LoadGlTF(this.GREEN_BLOCK_KEY);
	}


	private async LoadTexture(url: string): Promise<THREE.Texture> {
		return new Promise((resolve, reject) => {
			this.textureLoader.load(url, (texture) => {
				texture.anisotropy = 16
				resolve(texture)
			}, (progress) => {
				// note: onProgress callback currently not supported
				// console.log(progress)
			}, (e) => {
				reject(e)
			})
		})
	}

	private async LoadGlTF(url: string): Promise<GLTF> {
		return new Promise((resolve, reject) => {
			this.gltfLoader.load(url, (gltf) => {
				resolve(gltf)
			}, (progress) => {
				// note: onProgress callback currently not supported
				// console.log(progress)
			}, (e) => {
				reject(e)
			})
		})
	}

}
