import Util from "../util.js";

export default class Weather {
	static async Init(callback) {
		while (true) {
			try {
				var weather = await this.getOpenMeteo();

				var list = Object.keys(weather);

				for (let i = 0; i < list.length; i++) {
					if (typeof weather[list[i]] == "number") {
						callback(list[i], weather[list[i]]);
					}
				}
			} catch (error) {
				console.error("Error:", error);
			}

			await Util.delay(Math.round(1000 * 60 * 60 * 24 / (10000 / 11)));
		}
	}

	static async getOpenMeteo() {
		var f = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-10.2196684&longitude=-37.4189864&hourly=precipitation_probability&current=temperature_2m,relative_humidity_2m,apparent_temperature&timezone=America%2FSao_Paulo&forecast_days=1");

		var json = await f.json();

		var list = json.hourly.time;

		var now = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3);

		var probability = 0;

		for (let i = 0; i < list.length; i++) {
			if ((new Date(list[i])).getHours() == now.getHours()) {
				probability = json.hourly.precipitation_probability[i];
			}
		}

		return {
			temperature: json.current.temperature_2m,
			sensation: json.current.apparent_temperature,
			humidity: json.current.relative_humidity_2m,
			rain: probability
		}
	}
}