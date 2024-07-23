import express from "express";
import Util from "./util.js";
import http from "http";

export default class Server {
	static Init(port) {
		var app = express();

		app.disable("x-powered-by");

		var server = http.createServer(app);

		this.port = port;

		this.app = app;
		this.server = server;
	}

	static sendFile(path, response) {
		if (Util.verifyPath(path)) {
			if (Util.readStats(path).isFile()) {
				var stream = Util.readStream(path);

				return stream.pipe(response);
			}
		}

		return response.sendStatus(404);
	}

	static registryFile(path, file) {
		var context = this;

		this.app.get(path, function(request, response) {
			context.sendFile(file, response);
		});
	}

	static registryFolder(path) {
		var context = this;

		this.app.get(path + "/*", function(request, response) {
			var args = request.url.split("/");

			var file = Util.joinPath("." + path, args.slice(2).join("/"));

			context.sendFile(file, response);
		});
	}

	static start() {
		this.app.use(function(request, response) {
			response.sendStatus(404);
		});

		var context = this;

		return new Promise(function(resolve, reject) {
			context.server.listen(context.port, resolve);
		});
	}
}