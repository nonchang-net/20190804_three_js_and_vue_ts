export default class Utils {

	// async sleep
	// https://qiita.com/asa-taka/items/888bc5a1d7f30ee7eda2
	public static Sleep = (msec: number) => new Promise( (resolve) => setTimeout(resolve, msec));
}
