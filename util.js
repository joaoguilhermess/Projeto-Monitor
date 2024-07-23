import path from "path";
import fs from "fs";

export default class Util {
	static joinPath(...args) {
		return path.join(...args);
	}

	static verifyPath(path) {
		return fs.existsSync(path);
	}

	static readStats(path) {
		return fs.lstatSync(path);
	}

	static readStream(path) {
		return fs.createReadStream(path);
	}

	static readJSON(path) {
		return JSON.parse(fs.readFileSync(path).toString());
	}

	static writeJSON(path, content) {
		return fs.writeFileSync(path, JSON.stringify(content, null, "\t"));
	}

	static createFolder(path) {
		return fs.mkdirSync(path);
	}

	static readFolder(path) {
		return fs.readdirSync(path);
	}

	static delay(time) {
		return new Promise(function(resolve, reject) {
			setTimeout(resolve, time);
		});
	}
}