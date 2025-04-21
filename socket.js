import {Server as IO} from "socket.io";
import Server from "./server.js";

export default class Socket {
	static Init(callback) {
		var io = new IO(Server.server);

		io.on("connection", callback);

		this.io = io;
	}

	static emit(...args) {
		this.io.emit(...args);
	}
}