import Util from "./util.js";

export default class Data {
	static Init() {
		this.folder = "./data";

		Util.ensureFolder(this.folder);
	}

	static read(file) {
		file = Util.joinPath(this.folder, file);

		Util.ensureFolder(this.folder);

		if (Util.verifyPath(file)) {
			try {
				return Util.readJSON(file);
			} catch {}
		}
	}

	static save(file, content) {
		file = Util.joinPath(this.folder, file);

		Util.ensureFolder(this.folder);

		Util.writeJSON(file, content);
	}
}