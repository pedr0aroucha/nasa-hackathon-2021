export function Loading() {
	const element = document.getElementById("loading");

	if (!element) return;

	function start() {
		element.style.display = "inline-block";
	}

	function stop() {
		element.style.display = "none";
	}

	return {
		start,
		stop,
	};
}
