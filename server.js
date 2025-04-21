import bodyParser from "body-parser";
import express from "express";
import Util from "./util.js";
import http from "http";

export default class Server {
	static Init() {
		var app = express();

		app.disable("x-powered-by");

		app.use(bodyParser.json());

		var server = http.createServer(app);

		this.app = app;
		this.server = server;
	}

	static async sendFile(path, response) {
		if (await Util.verifyPath(path) && await Util.isFile(path)) {
			var stream = Util.readStream(path);

			var args = path.split(".");

			var extension = args[args.length - 1];

			response.contentType(extension);

			return stream.pipe(response);
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

	static async start(port) {
		this.app.use(function(request, response) {
			response.sendStatus(404);
		});

		var context = this;

		await new Promise(function(resolve, reject) {
			context.server.listen(port, resolve);
		});

		this.port = port;
	}
}