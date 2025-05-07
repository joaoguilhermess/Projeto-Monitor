import Util from "../util.js";

export default class Weather {
	static async Init(callback) {
		this.url = "https://api.open-meteo.com/v1/forecast?latitude=-10.2196684&longitude=-37.4189864&models=best_match&current=precipitation_probability,precipitation,temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m&timezone=America%2FSao_Paulo";

		this.codes = {
			"0": "Céu Limpo",
			"1": "Pouco Nublado",
			"2": "Parcialmente Nublado",
			"3": "Nublado",
			"45": "Nevoeiro",
			"48": "Nevoeiro Com Geada",
			"51": "Sereno Fraco",
			"53": "Sereno Moderado",
			"55": "Sereno Forte",
			"56": "Sereno Congelante Fraco",
			"57": "Sereno Congelante Forte",
			"61": "Chuva Fraca",
			"63": "Chuva Moderada",
			"66": "Chuva Congelante Fraca",
			"67": "Chuva Congelante Forte",
			"71": "Neve Fraca",
			"73": "Neve Moderada",
			"75": "Neve Forte",
			"77": "Flocos De Neve",
			"80": "Pancadas De Chuva Fraca",
			"81": "Pancadas De Chuva Moderada",
			"82": "Pancadas De Chuva Forte",
			"85": "Pancadas De Neve Fraca",
			"86": "Pancadas De Neve Forte",
			"95": "Trovoada",
			"96": "Trovoada Com Granizo Fraco",
			"99": "Trovoada Com Granizo Forte",
		};

		while (true) {
			try {
				var weather = await this.getOpenMeteo();

				var list = Object.keys(weather);

				for (let i = 0; i < list.length; i++) {
					if (list[i].toString().length > 0) {
						callback(list[i], weather[list[i]]);
					}
				}
			} catch (error) {
				console.error("Error:", error);
			}

			// await Util.delay(Math.round(1000 * 60 * 60 * 24 / (10000 / 11)));
			await Util.delay(1000 * 60 * 2.5);
		}
	}

	static async getOpenMeteo() {
		var f = await fetch(this.url);

		var json = await f.json();

		return {
			realTemperature: json.current.temperature_2m,
			apparentTemperature: json.current.apparent_temperature,
			relativeHumidity: json.current.relative_humidity_2m,
			precipitationProbability: json.current.precipitation_probability,
			precipitationAmout: json.current.precipitation,
			windSpeed: json.current.wind_speed_10m,
			cloudsCover: json.current.cloud_cover,
			weatherCode: this.codes[json.current.weather_code]
		}
	}

	static async getOpenMeteo2() {
		// var f = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-10.2196684&longitude=-37.4189864&hourly=precipitation_probability&current=temperature_2m,relative_humidity_2m,apparent_temperature&timezone=America%2FSao_Paulo&forecast_days=1");

		var json = await f.json();

		var list = json.hourly.time;

		var now = (new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)).getTime();

		var probability = 0;

		for (let i = 0; i < list.length; i++) {
			if (Math.abs((new Date(list[i])).getTime() - now) < (1000 * 60 * 30)) {
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