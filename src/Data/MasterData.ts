/**
 * MasterData.ts
 * - マスターデータクラス
 * - ゲーム中変動しないデータ
 * - 運営が更新かける可能性はある。変更があった場合はタイトルに戻して更新させるようなイメージ
 */

export default class MasterData {

	lastUpdate: number = -1

	// monsters: Monsters
	// characters: Characters

	async asyncSetup(lastUpdate: number) {
		//TODO: S3からローカルストレージにlastUpdateを保存・読み込み・差分確認
		// - また、マスターデータクラス系の更新処理は共通処理なので継承関係にしていいと思う
		// if (this.lastUpdate < lastUpdate) {
		// 	this.monsters = await new Monsters().asyncSetup()
		// 	this.characters = await new Characters().asyncSetup()
		// 	// console.log("check:", this.monsters, this.characters)
		// 	this.lastUpdate = lastUpdate
		// 	this.Save()
		// }
	}

	// TODO: ローカルストレージにバージョン保存
	Save() {
	}
}