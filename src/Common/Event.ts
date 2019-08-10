/*

# Event.ts

Copyright(C) nonchang.net All rights reserved.

## 概要

- DOMを使わないシンプルなイベント
- 発行はbroadcastのみ
- 購読・購読解除のsubscribe、unsubscribe

## TODO

- ユニットテスト書かなきゃ

*/



export default class SimpleEvent<T> {

	private handlers: any // サブスクライバのメソッドリスト
	// TODO: できればanyやめたいけどstringをキーに取るメソッドの
	// hashmap表現方法が思いつかず保留中。多分typescriptの理解不足がある気がする。

	public subscribe(subscriberName: string, func: (arg: T) => any) {
		if (!this.handlers) {
			this.handlers = {};
		}
		if (!this.handlers[subscriberName]) {
			this.init(subscriberName);
		}
		this.handlers[subscriberName].push(func);
	}

	public unsubscribe(subscriberName: string) {
		this.init(subscriberName);
	}

	public broadcast(arg?: T) {
		for (const subscriber of this.handlers) {
			for (const handler of subscriber) {
				handler.apply(this, arguments);
			}
		}
	}

	private init(subscriberName: string) {
		this.handlers[subscriberName] = [];
	}
}

// value:Tに代入すると自動でイベントをbroadcastするプロパティ
/*

TODO: ただのSimpleEventのラッパにすぎないことに注意。
- せっかくだから、ReadOnlyReactivePropertyに相当するものをシンプルに書けないだろうか？
	- valueのgetとsubscribeはpublicで、valueのセッターは利用者側でprivateにしたい。
- 個人開発では「外部から変更しないこと」というルールを徹底すれば混乱は避けられるだろうけど、TypeScriptの意義が……
- 利用側で以下のように書けば一応実現できるけど、記述量が苦しいように感じる。

	private gameState = new ReactiveProperty(GameStateKind.Opening)
	public get GameState() {
		return this.gameState.value
	}
	public SubscribeGameState(subscriverName:string, func: (arg: GameStateKind) => any) {
		this.gameState.subscribe(subscriverName, func)
	}
*/
export class ReactiveProperty<T> {

	private event: SimpleEvent<T>;
	private prop: T;

	constructor(arg: T) {
		this.prop = arg;
		this.event = new SimpleEvent<T>();
	}

	public set value(arg: T) {
		this.prop = arg;
		this.event.broadcast(arg);
	}

	public get value(): T {
		return this.prop;
	}

	public subscribe(subscriberName: string, func: (arg: T) => any) {
		this.event.subscribe(subscriberName, func);
	}

	public unsubscribe(subscriberName: string) {
		this.event.unsubscribe(subscriberName);
	}
}
