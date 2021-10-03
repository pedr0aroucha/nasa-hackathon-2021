import { handleNodeClick } from "./handleNodeClick.js";
import { updatePane } from "./updatePane.js";
import { applyCategoryFilter } from "./applyCategoryFilter.js";

export function renderNodes(jsonUrl) {
	sigma.parsers.json(
		jsonUrl,
		{
			container: "graph-container",
			settings: {
				defaultLabelColor: "#fff",
				defaultLabelSize: 20,
			},
		},
		function (s) {
			const filter = new sigma.plugins.filter(s);

			handleNodeClick(s);
			updatePane(s.graph, filter);
			document
				.getElementById("node-category")
				.addEventListener("change", (event) =>
					applyCategoryFilter(event, filter),
				);
		},
	);
}
