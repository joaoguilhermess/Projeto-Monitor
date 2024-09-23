import SocketIO from "./socketio.js";
import Modules from "./modules.js";
import Server from "./server.js";
import Util from "./util.js";
import Data from "./data.js";

class Main {
	static async Init() {
		Server.Init(4000);

		Server.registryFile("/", Util.joinPath("public", "index.html"));

		Server.registryFolder("/public");

		var values = {};

		SocketIO.Init(Server.server, function(socket) {
			var list = Object.keys(values);

			for (let i = 0; i < list.length; i++) {
				SocketIO.emit("module", list[i]);

				SocketIO.emit("update", list[i], values[list[i]].value);
			}
		});

		await Server.start();

		console.log("Ready");

		Data.Init();

		Modules.Init("./modules", "./modules.json");

		Modules.start(function(_module, value) {
			if (!values[_module]) {
				SocketIO.emit("module", _module);

				values[_module] = {value: value};
			}

			if (values[_module].value != value) {
				SocketIO.emit("update", _module, value);

				values[_module].value = value;
			}
		});
	}
}

Main.Init();