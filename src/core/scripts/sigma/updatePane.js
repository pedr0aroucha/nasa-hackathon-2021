export function updatePane(graph, filter) {
	// get max degree
	let maxDegree = 0;

	const categories = {};

	// read nodes
	graph.nodes().forEach(function (node) {
		maxDegree = Math.max(maxDegree, graph.degree(node.id));
		categories[node.category] = true;
	});

	// node category
	const nodecategoryElement = document.getElementById("node-category");
	Object.keys(categories).forEach(function (category) {
		const optionElement = document.createElement("option");

		optionElement.text = category;

		nodecategoryElement.appendChild(optionElement);
	});

	// reset button
	document
		.getElementById("reset-btn")
		.addEventListener("click", function (event) {
			nodecategoryElement.selectedIndex = 0;

			filter.undo().apply();

			const dump = document.getElementById("dump");

			dump.textContent = "";
			dump.classList.remove("hidden");
		});

	// export button

	document
		.getElementById("export-btn")
		.addEventListener("click", function (event) {
			const chain = filter.export();

			const dump = document.getElementById("dump");
			dump.textContent = JSON.stringify(chain);
			dump.classList.remove("hidden");
		});
}
