import Modules from "./modules.js";
import Server from "./server.js";
import Socket from "./socket.js";
import Util from "./util.js";

class Main {
	static async Init() {
		await Server.Init();

		Server.registryFile("/", Util.joinPath("public", "index.html"));

		Server.registryFolder("/public");

		var values = {};

		Socket.Init(function(socket) {
			var list = Object.keys(values);

			for (let i = 0; i < list.length; i++) {
				socket.emit("update", list[i], values[list[i]]);
			}
		});

		Modules.Init("./modules", "./modules.json");

		await Modules.start(function(name, value) {
			if (!values[name]) {
				values[name] = value;
			}

			if (values[name] != value) {
				Socket.emit("update", name, value);

				values[name] = value;
			}
		});

		await Server.start(4000);
		
		console.log("Ready");
	}
}

Main.Init();