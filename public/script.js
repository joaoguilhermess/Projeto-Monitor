class Monitor {
	static Init() {
		this.hour = document.querySelector("#hour");
		this.minute = document.querySelector("#minute");
		this.second = document.querySelector("#second");
		this.notifications = document.querySelector("#notifications");
		this.temperature = document.querySelector("#temperature");
		this.humidity = document.querySelector("#humidity");

		this.lights = [1, 1/2, 1/4, 1/8, 0];
		this.light = 0;

		this.addLight();

		this.addFullscreen();

		this.InitSocketIO();

		this.addClock();
	}

	static addOnLoad() {
		window.addEventListener("load", function() {
			document.body.style.display = "flex";
		});
	}

	static addLight() {
		var context = this;

		window.addEventListener("click", function() {
			if (document.fullscreen) {
				context.updateLight();
			}
		});
	}

	static updateLight() {
		this.light += 1;

		if (this.light > this.lights.length - 1) {
			this.light = 0;
		}

		document.body.style.color = "rgba(200, 200, 200, " + this.lights[this.light] + ")";
	}

	static addFullscreen() {
		window.addEventListener("click", function() {
			if (!document.fullscreen) {
				document.body.requestFullscreen();
			}
		});
	}

	static InitSocketIO() {
		var socket = io();

		var context = this;

		socket.on("update", function(name, value) {
			var items = {
				"notifications": context.notifications,
				"temperature": context.temperature,
				"humidity": context.humidity,
			}

			var item = items[name];

			if (item) {
				item.textContent = value;
			}
		});

		this.socket = socket;
	}

	static addClock() {
		this.updateClock();

		var context = this;

		setTimeout(function() {
			context.updateClock();

			setInterval(function() {
				context.updateClock();
			});
		}, 1000 - Date.now().toString().slice(-3));
	}
	
	static updateClock() {
		var t = new Date(Date.now() + (9 * 1000));

		this.hour.textContent = this.formatNumber(t.getHours());
		this.minute.textContent = this.formatNumber(t.getMinutes());
		this.second.textContent = this.formatNumber(t.getSeconds());
	}

	static formatNumber(n, l = 2) {
		n = n.toString();

		while (n.length < l) {
			n = "0" + n;
		}

		return n;
	}
}

Monitor.Init();