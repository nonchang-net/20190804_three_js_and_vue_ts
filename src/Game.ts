/**
 * Game.ts
 * - Game本体の管理
 */

import * as THREE from 'three';
import ThreeContext from './Game/ThreeContext'
import View from './Game/View'
import Loader from './Game/Loader'

export default class Game {

	private scene = new THREE.Scene();
	private context!: ThreeContext;

	public async InitializeAsync(
		wrapperElement: HTMLElement,
		canvasElement: HTMLCanvasElement,
	) {

		const loader = new Loader();
		await loader.LoadAsync()

		const context: ThreeContext = {
			game: this,
			scene: this.scene,
			loader: loader,
		}
		this.context = context

		context.view = new View()
		await context.view.InitializeAsync(
			this.context,
			wrapperElement,
			canvasElement,
		)
	}
}
