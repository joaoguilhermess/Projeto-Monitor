import Util from "../util.js";

export default class Weather {
	static async Init(callback) {
		this.token = "2c2dfe9000b9467bb546e427b75ad362";
		this.city = 4560;

		while (true) {
			var weather = await this.getWeather();

			if (typeof weather.sensation == "number") {
				callback("temperature", weather.sensation);
			}

			if (typeof weather.humidity == "number") {
				callback("humidity", weather.humidity);
			}

			await Util.delay(15 * 60 * 1000);
		}
	}

	static async getWeather() {
		await Util.delay(1000);

		var f = await fetch("http://apiadvisor.climatempo.com.br/api/v1/weather/locale/" + this.city + "/current?token=" + this.token);

		var json = await f.json();

		return json.data;
	}
}