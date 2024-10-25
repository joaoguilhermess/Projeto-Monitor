import Data from "../data.js";
import Util from "../util.js";

export default class Sigaa {
	static async Init(callback) {
		return;

		this.file = "./sigaa.json";

		this.delay = 1000;

		while (true) {
			this.read();

			if (this.data) {
				if (!this.data.session) {
					await this.login();
				}
			} else {
				this.data = {
					"user": "",
					"password": "",
					"session": ""
				};

				this.save();

				return;
			}

			var unRead = await this.getCaixaPostal();

			if (typeof unRead == "number") {
				callback("notifications", unRead);
			} else {
				await this.login();
			}
		}
	}

	static read() {
		this.data = Data.read(this.file);
	}

	static save() {
		Data.save(this.file, this.data);
	}
	
	static async getSession() {
		await Util.delay(this.delay);

		var f = await fetch("https://www.sigaa.ufs.br/sigaa/verTelaLogin.do");

		await f.text();

		var cookie = f.headers.get("set-cookie");

		cookie = cookie.split(";")[0];

		this.data.session = cookie;
	}

	static async login() {
		await this.getSession();

		await Util.delay(this.delay);

		var f = await fetch("https://www.sigaa.ufs.br/sigaa/logar.do?dispatch=logOn", {
			"method": "POST",
			"headers": {
				"content-type": "application/x-www-form-urlencoded",
				"cookie": this.data.session + "; www.sigaa.ufs.br=cookieUfs"
			},
			"body": "width=1366&height=768&urlRedirect=&acao=&acessibilidade=&user.login=" + encodeURIComponent(this.data.user) + "&user.senha=" + encodeURIComponent(this.data.password)
		});

		var text = await f.text();

		this.save();
	}

	static async getCaixaPostal() {
		await Util.delay(this.delay);

		var f = await fetch("https://www.sigaa.ufs.br/sigaa/verMenuPrincipal.do", {
			"headers": {
				"cookie": this.data.session + "; www.sigaa.ufs.br=cookieUfs"
			}
		});

		var text = await f.text();

		if (text.split(">")[0] == "<script") {
			return;
		}

		if (text.includes("Cx. Postal")) {
			text = text.split("Cx. Postal <font color=\"red\" style=\"font-size:0.7em;\">(")[1];

			text = text.split(")")[0];

			return parseInt(text);
		}

		return 0;
	}
}