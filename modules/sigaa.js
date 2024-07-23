import Data from "../data.js";
import Util from "../util.js";

export default class Sigaa {
	static async Init(callback) {
		this.file = "./sigaa.json";

		while (true) {
			this.session = Data.read(this.file);

			if (!this.session) {
				await this.getSession();
			} else {
				this.session = this.session.session;
			}

			await this.login();

			var unRead = await this.getCaixaPostal();

			if (unRead) {
				callback("notifications", unRead);
			} else {
				await this.getSession();

				await this.login();

				await this.getCaixaPostal();
			}

			await Util.delay(1000);
		}
	}
	
	static async getSession() {
		var f = await fetch("https://www.sigaa.ufs.br/sigaa/verTelaLogin.do");

		await f.text();

		var cookie = f.headers.get("set-cookie");

		cookie = cookie.split(";")[0];

		this.session = cookie;

		Data.save(this.file, {session: this.session});
	}

	static async login() {
		var f = await fetch("https://www.sigaa.ufs.br/sigaa/logar.do?dispatch=logOn", {
			"method": "POST",
			"headers": {
				"content-type": "application/x-www-form-urlencoded",
				"cookie": this.session + "; www.sigaa.ufs.br=cookieUfs"
			},
			"body": "width=1366&height=768&urlRedirect=&acao=&acessibilidade=&user.login=joaoguilhermess&user.senha=jg%231453647"
		});

		var text = await f.text();
	}

	static async getCaixaPostal() {
		var f = await fetch("https://www.sigaa.ufs.br/sigaa/verMenuPrincipal.do", {
			"headers": {
				"cookie": this.session + "; www.sigaa.ufs.br=cookieUfs"
			}
		});

		var text = await f.text();

		if (text.includes("Cx. Postal")) {
			text = text.split("Cx. Postal <font color=\"red\" style=\"font-size:0.7em;\">(")[1];

			text = text.split(")")[0];

			return text;
		} else {
			return "0";
		}
	}
}