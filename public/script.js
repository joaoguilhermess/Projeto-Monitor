class Monitor {
	static Init() {
		this.items = {};

		this.days = [
			"Domingo",
			"Segunda",
			"Terça",
			"Quarta",
			"Quinta",
			"Sexta",
			"Sábado"
		];

		this.months = [
			"Janeiro",
			"Fevereiro",
			"Março",
			"Abril",
			"Maio",
			"Junho",
			"Julho",
			"Agosto",
			"Setembro",
			"Outubro",
			"Novembro",
			"Dezembro"
		];

		this.modes = [];

		this.mode = 0;

		this.addFullscreen();

		// this.addBackground();

		this.addSocket();

		this.addClock();

		this.addChronometer();

		this.addAcelerometer();

		this.addUpdate();
	}

	static addFullscreen() {
		window.addEventListener("click", async function() {
			if (!document.fullscreen) {
				document.body.requestFullscreen();

				await navigator.wakeLock.request("screen");
			}
		});
	}

	static addBackground() {
		var background = document.querySelector("#background");

		var k = 0;

		background.addEventListener("load", function() {
			k += 1;

			setTimeout(function() {
				background.src = "https://cataas.com/cat/gif?random=" + k;
			}, 1000);
		});

		background.src = "https://cataas.com/cat/gif?random=" + k;
	}

	static addSocket() {
		var socket = io();

		var context = this;

		socket.on("update", function(name, value) {
			context.setValue(name, value);
		});

		this.socket = socket;
	}

	static addClock() {
		var context = this;

		this.modes.push({
			name: "Relógio",
			start: function() {
				context.setValue("clock", "");
			},
			update: function() {
				var t = new Date();

				context.setValue("hour", context.format(t.getHours()));
				context.setValue("minute", context.format(t.getMinutes()));
				context.setValue("second", context.format(t.getSeconds()));

				context.setValue("day", context.days[t.getDay()]);

				context.setValue("date", [context.format(t.getDate()), context.months[t.getMonth()], context.format(t.getFullYear(), 4)].join(" de "));
			}
		});
	}

	static addChronometer() {
		var context = this;

		var startTime;

		this.modes.push({
			name: "Cronometro",
			start: function() {
				context.setValue("day", "Cronometro");

				context.setValue("date", "");

				startTime = Date.now();
			},
			update: function() {
				var t = new Date(Date.now() - startTime + (1000 * 60 * 60 * 3));

				context.setValue("hour", context.format(t.getHours()));
				context.setValue("minute", context.format(t.getMinutes()));
				context.setValue("second", context.format(t.getSeconds()));

				t = new Date();

				context.setValue("clock", [context.format(t.getHours()), context.format(t.getMinutes()), context.format(t.getSeconds())].join(":"));
			}
		});

		this.modes.push({
			name: "Cronometro",
			start: function() {
				context.setValue("day", "Cronometro Pausado");
			},
			update: function() {
				var t = new Date();

				context.setValue("clock", [context.format(t.getHours()), context.format(t.getMinutes()), context.format(t.getSeconds())].join(":"));
			}
		});
	}

	static addAcelerometer() {
		var accelerometer = new Accelerometer({frequency: 2});

		var context = this;

		var free = true;

		accelerometer.addEventListener("reading", function() {
			if (Math.round(accelerometer.z) < -9) {
				if (free == true) {
					context.changeMode();
				
					free = false;
				}
			} else {
				free = true;
			}
		});

		accelerometer.start();
	}

	static addUpdate() {
		var	context = this;

		setTimeout(function() {
			context.update();

			setInterval(function() {
				context.update();
			}, 1000);
		}, 1000 - parseInt(Date.now().toString().slice(-3)) + (1000 / 20));

		this.update();		
	}

	static changeMode() {
		this.mode += 1;

		if (this.mode >= this.modes.length) {
			this.mode = 0;
		}

		this.update(true);
	}

	static update(start) {
		if (this.modes[this.mode]) {
			if (start && this.modes[this.mode].start) {
				this.modes[this.mode].start();
			}
		
			if (this.modes[this.mode].update) {
				this.modes[this.mode].update();
			}
		}
	}

	static setValue(name, value) {
		if (!this.items[name]) {
			var item = document.querySelector("#" + name);

			if (item) this.items[name] = item;
		}

		var item = this.items[name];

		if (item) item.textContent = value;
	}

	static format(number, length = 2) {
		number = number.toString();

		while (number.length < length) {
			number = "0" + number;
		}

		return number;
	}
}

Monitor.Init();