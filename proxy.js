import fetch from "node-fetch";
import express from "express";

class Proxy {
	static Init() {
		this.base = "http://192.168.0.116:4000";

		this.start();
	}

	static start() {
		var app = express();

		app.get("*", async function(request, response) {
			var f = await fetch(base + request.url);

			f.body.pipe(response);
		});

		app.listen(3000, function() {
			console.log("Ready");
		});

		this.app = app;
	}
}

Proxy.Init();