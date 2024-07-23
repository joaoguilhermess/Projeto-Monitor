import Util from "../util.js";

export default class Weather {
	static async Init(callback) {
		this.token = "2c2dfe9000b9467bb546e427b75ad362";
		this.city = 4560;

		while (true) {
			var weather = await this.getWeather();

			callback("temperature", weather.sensation);
			callback("humidity", weather.humidity);

			await Util.delay(15 * 60 * 1000);
		}
	}

	static async getWeather() {
		var f = await fetch("http://apiadvisor.climatempo.com.br/api/v1/weather/locale/" + this.city + "/current?token=" + this.token);

		var json = await f.json();

		return json.data;
	}
}