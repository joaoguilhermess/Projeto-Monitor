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

		// this.addAcelerometer();

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
			console.log("Cat!");
	
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
		this.modes.push({
			name: "Relógio",
			callback: function() {
				var t = new Date();

				this.setValue("hour", this.format(t.getHours()));
				this.setValue("minute", this.format(t.getMinutes()));
				this.setValue("second", this.format(t.getSeconds()));

				this.setValue("day", this.days[t.getDay()]);

				this.setValue("date", [this.format(t.getDate()), this.months[t.getMonth()], this.format(t.getFullYear(), 4)].join(" de "));
			}
		});
	}

	static addAcelerometer() {
		var accelerometer = new Accelerometer({frequency: 1});

		var context = this;

		var rad = 180 / Math.PI;

		var last = 0;

		accelerometer.addEventListener("reading", function() {
			if (Math.round(accelerometer.z) < -9) {
				last += 1; 
			} else {
				last = 0;
			}

			if (last > 5) {
				last = Infinity;
			}

			context.setValue("accelerometer", last);
		});

		accelerometer.start();
	}

	static addUpdate() {
		context.modes[context.mode].callback();

		var	context = this;

		setTimeout(function() {
			context.modes[context.mode].callback();

			setInterval(function() {
				context.modes[context.mode].callback();
			}, 1000);
		}, 1000 - parseInt(Date.now().toString().slice(-3)) + (1000 / 20));
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