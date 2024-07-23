import Util from "./util.js";

export default class Data {
	static Init() {
		this.folder = "./data";

		this.verifyFolder();
	}

	static verifyFolder() {
		if (!Util.verifyPath(this.folder)) {
			Util.createFolder(this.folder);
		}
	}

	static read(file) {
		file = Util.joinPath(this.folder, file);

		this.verifyFolder();

		if (Util.verifyPath(file)) {
			try {
				return Util.readJSON(file);
			} catch {}
		}
	}

	static save(file, content) {
		file = Util.joinPath(this.folder, file);

		this.verifyFolder();

		Util.writeJSON(file, content);
	}
}