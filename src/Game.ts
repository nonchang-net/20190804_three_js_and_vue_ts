/**
 * Game.ts
 * - Game本体の管理
 * - THREE固有の実装はGame/View.tsに任せる
 */

import View from './Game/View'

export default class Game {
	constructor(wrapperElement: HTMLElement, canvasElement: HTMLCanvasElement) {
		const view = new View(wrapperElement, canvasElement);
	}
}
