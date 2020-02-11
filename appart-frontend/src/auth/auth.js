/*
 *   Authenticate module.
 *
 *   @author           Andrey Perestyuk (Arrathilar)
 *   @email-primary    a.perestyuk@itel.rv.ua
 *   @email-secondary  arrathilar@blizzard.com, a.perestyuk@archlinux.org,
 *   @copyright        2020 ITEL-Service
 *
 */

export default class Auth {
	constructor(authenticate = false) {
		this.authenticate = authenticate
	}

	/*
	 * isAuthenticate(): void
	 *
	 * check if client is authorised
	 * return "true" when user have auth token, and "false" when don't have
	 */
	isAuthenticate() {
		let g_auth = localStorage.getItem("auth");
		if (g_auth == null) {
			g_auth = sessionStorage.getItem("auth");
		}
		fetch(process.env.REACT_APP_USER_DATA, {
			headers: {
				"Authorization": "Token " + this.getAuthToken()
			}
		})
			.then(res => res.json())
			.then(
				result => {
					console.log(result)
					console.log(true)
					return true
				},
				error => {
					console.log(false)
					return false
				}
			);
	}

	/*
	 * getAuthToken()
	 *
	 * return auth token from
	 * local storage (in case when user activate checkbox "remember me")
	 * or from session storage
	 */
	getAuthToken() {
		let g_session_token = localStorage.getItem("auth");
		if (g_session_token) {
			if (g_session_token == null) {
				g_session_token = sessionStorage.getItem("auth");
			}
			return g_session_token.split(':')[1].replace(/["}]+/g, '')
		} else {
			return false
		}

	}

	/*
	 * method Auth.login(
	 * 	email?,
	 * 	password?): Promise<void>
	 *
	 * get parameters from backend
	 * end put it to local storage
	 */
	async login(email, password) {
		let result = await this.postLoginData(email, password);
		if (result.status < 400) {
			localStorage.setItem("auth", await result.text())
			window.location.reload(false);
		} else {
			const error = await result.json();
			if (error.non_field_errors) {
				// toast.error(error.non_field_errors[0])
			}
			if (error.email) {
				// toast.error(error.email[0])
			}
		}
	}

	logout() {
		localStorage.removeItem("auth");
		window.location.reload(false);
	}

	/*
	 * method postLoginData(email?, password?): Promise<Response | undefined>
	 *
	 * get parameters
	 * and post to backend
	 */
	async postLoginData(email, password) {
		try {
			const url = process.env.REACT_APP_LOGIN;
			const resp = fetch(url, {
				method: "POST",
				headers: {
					"Content-type": "application/json; charset=UTF-8"
				},
				body: JSON.stringify({username: email, password: password})
			});
			return resp
		} catch (err) {
			console.log(err)
		}
	}
}