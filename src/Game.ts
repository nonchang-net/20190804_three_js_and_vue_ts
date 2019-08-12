/**
 * Game.ts
 * - Game本体の管理
 * - THREE固有の実装はGame/View.tsに任せる
 * - ……あれ、ここでやることないかも
 */

import View from './Game/View'

export default class Game {

	private view!: View;

	public async InitializeAsync(
		wrapperElement: HTMLElement,
		canvasElement: HTMLCanvasElement,
	) {
		this.view = new View()
		await this.view.InitializeAsync(wrapperElement, canvasElement)
	}
}
