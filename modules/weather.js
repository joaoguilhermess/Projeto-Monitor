import Util from "../util.js";

export default class Weather {
	static async Init(callback) {
		while (true) {
			var weather = await this.getOpenMeteo();

			if (typeof weather.temperature == "number") {
				callback("temperature", Math.round(weather.temperature));
			}

			if (typeof weather.humidity == "number") {
				callback("humidity", Math.round(weather.humidity));
			}

			await Util.delay(15 * 60 * 1000);
		}
	}

	static async getClimaTempo() {
		await Util.delay(1000);

		var f = await fetch("http://apiadvisor.climatempo.com.br/api/v1/weather/locale/4560/current?token=2c2dfe9000b9467bb546e427b75ad362");

		var json = await f.json();

		return {
			temperature: json.data.sensation,
			humidity: json.data.humidity
		};
	}

	static async getOpenMeteo() {
		await Util.delay(1000);

		var f = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-10.2183&longitude=-37.4203&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=America%2FSao_Paulo&forecast_days=1");

		var json = await f.json();

		return {
			temperature: json.current.apparent_temperature,
			humidity: json.current.relative_humidity_2m
		}
	}
}