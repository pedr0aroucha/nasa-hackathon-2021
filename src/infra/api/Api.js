async function GET(path) {
	try {
		let headers = new Headers();
		let requestConfig = {
			method: "GET",
			headers,
			mode: "cors",
			cache: "default",
		};

		const URL_BASE = "https://octopus-nasa.herokuapp.com";
		const URI = `${URL_BASE}/${path}`;

		const request = new Request(URI, requestConfig);

		const response = await fetch(request);

		return await response.json();
	} catch (err) {
		throw new Error(err);
	}
}

export function Api() {
	return {
		GET,
	};
}
