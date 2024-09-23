import Util from "./util.js";

export default class Modules {
	static Init(folder, file) {
		this.folder = folder;
		this.file = file;
	}

	static async start(callback) {
		var modules = this.getModules();

		for (let i = 0; i < modules.length; i++) {
			let path = Util.joinPath(this.folder, modules[i]);

			if (Util.verifyPath(path)) {
				try {
					let file = await import("./" + path);

					if (file.default.Init) {
						file.default.Init(function(name, value) {
							callback(name, value);
						});
					}
				} catch (error) {
					console.error("error:", error);
				}
			}
		}
	}

	static getModules() {
		if (!Util.verifyPath(this.folder)) {
			Util.createFolder(this.folder);
		}

		var files = Util.readFolder(this.folder);

		var order = {
			enabled: [],
			disabled: []
		};

		if (Util.verifyPath(this.file)) {
			order = Util.readJSON(this.file);
		}

		for (let i = 0; i < files.length; i++) {
			let extension = files[i].split(".");

			extension = extension[extension.length - 1];

			if (!order.enabled.includes(files[i]) && !order.disabled.includes(files[i]) && extension == "js") {
				order.enabled.push(files[i]);
			}
		}

		for (let i = 0; i < order.enabled.length; i++) {
			if (!files.includes(order.enabled[i])) {
				order.enabled.splice(i, 1);

				i -= 1;
			}
		}

		for (let i = 0; i < order.disabled.length; i++) {
			if (!files.includes(order.disabled[i])) {
				order.disabled.splice(i, 1);

				i -= 1;
			}
		}

		if (Util.verifyPath(this.file)) {
			if (Util.readJSON(this.file) != order) {
				Util.writeJSON(this.file, order);
			}
		} else {
			Util.writeJSON(this.file, order);
		}

		return order.enabled;
	}
}