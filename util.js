import path from "path";
import fs from "fs";

export default class Util {
	static joinPath(...args) {
		return path.join(...args);
	}

	static async verifyPath(path) {
		try {
			await fs.promises.access(path);

			return true;
		} catch {
			return false;
		}
	}

	static async readStats(path) {
		return await fs.promises.lstat(path);
	}

	static async isFile(path) {
		return (await this.readStats(path)).isFile();
	}

	static readStream(path) {
		return fs.createReadStream(path);
	}

	static async readFile(path) {
		return await fs.promises.readFile(path);
	}

	static async writeFile(path, content) {
		return await fs.promises.writeFile(path, content);
	}

	static async readJSON(path) {
		return JSON.parse((await this.readFile(path)).toString());
	}

	static async writeJSON(path, content) {
		return await this.writeFile(path, JSON.stringify(content, null, "\t"));
	}

	static async createFolder(path) {
		return await fs.promises.mkdir(path);
	}

	static async readFolder(path) {
		return await fs.promises.readdir(path);
	}

	static async ensureFolder(path) {
		if (!await this.verifyPath(path)) {
			return await this.createFolder(path);
		}
	}

	static async delay(duration) {
		return await new Promise(function(resolve, reject) {
			setTimeout(resolve, duration);
		});
	}
}