/**
 * ユーザデータクラス
 * - ゲームプレイ状態全体を管理
 * - サーバ保存ゲームの場合は通信結果の保存流用クラスとなる
 * - クライアント保存で済むデータは必要に応じてローカルストレージ保存
 * - アイテムのmasterDataIdを持たせるケースなど、
 * 		ユーザーデータ自体からマスターデータを参照することがよくあるので、
 * 		コンストラクタインジェクションでMasterDataを渡している。
 * 		（なおこのサンプルで実例があるかどうかは不明。というかなさそう）
 */

import { ReactiveProperty } from '../Common/Event';
import GameStateKind from './GameStateKind';
import MasterData from './MasterData';

export default class UserData {

	// ゲーム状態
	public gameState = new ReactiveProperty(GameStateKind.Title);

	// ハイスコア
	// - 外部からは読み込み専用。Save時にcurrentScoreで更新
	private highScoreInternal: number = 0;
	get highScore(): number { return this.highScoreInternal; }

	// 現在のスコア
	private currentScore: number = 0;


	constructor(master: MasterData) {
		// note: このサンプルでは多分やることがない
	}

	public Save() {
		// TODO: ハイスコア保存
	}

	private Load() {
		// TODO: ハイスコア読み込み
	}
}
