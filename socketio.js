import {Server as IO} from "socket.io";

export default class SocketIO {
	static Init(server, callback) {
		this.server = server;

		this.callback = callback;

		this.registrySocketIO();
	}

	static registrySocketIO() {
		var io = new IO(this.server);

		var context = this;

		io.on("connection", this.callback);

		this.io = io;
	}

	static emit(...args) {
		this.io.emit(...args);
	}
}