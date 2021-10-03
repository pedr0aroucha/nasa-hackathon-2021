export function getUrlParams(param) {
	const url_string = window.location.href;
	const url = new URL(url_string);

	return url.searchParams.get(param);
}
