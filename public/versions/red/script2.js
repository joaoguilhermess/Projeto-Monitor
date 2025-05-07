class Monitor {
	static Init() {
		this.items = {};

		this.addFullscreen();

		this.addClock();

		this.addSocket();
	}

	static addFullscreen() {
		window.addEventListener("click", async function() {
			if (!document.fullscreen) {
				document.body.requestFullscreen();

				await navigator.wakeLock.request("screen");
			}
		});
	}

	static addClock() {
		this.update();

		var	context = this;

		setTimeout(function() {
			context.update();

			setInterval(function() {
				context.update();
			}, 1000);
		}, 1000 - parseInt(Date.now().toString().slice(-3)) + (1000 / 20));
	}

	static addSocket() {
		var socket = io();

		var context = this;

		socket.on("update", function(name, value) {
			context.setValue(name, value);
		});

		this.socket = socket;
	}

	static setValue(name, value) {
		if (!this.items[name]) {
			var item = document.querySelector("#" + name);

			if (item) this.items[name] = item;
		}

		var item = this.items[name];

		if (item) item.textContent = value;
	}

	static update() {
		var t = new Date();

		this.setValue("hour", this.format(t.getHours()));
		this.setValue("minute", this.format(t.getMinutes()));
		this.setValue("second", this.format(t.getSeconds()));

		this.setValue("date", this.format(t.getDate()));
		this.setValue("month", this.format(t.getMonth() + 1));
		this.setValue("year", this.format(t.getFullYear(), 4));

		this.setValue("classes", Math.max(0, Math.floor((((new Date(2025, 5 - 1, 12).getTime()) - Date.now()) / (1000 * 60 * 60 * 24)) + 1)));
		this.setValue("birthday", Math.max(0, Math.floor((((new Date(2025, 8 - 1, 23).getTime()) - Date.now()) / (1000 * 60 * 60 * 24)) + 1)));
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