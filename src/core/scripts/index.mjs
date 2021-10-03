import { Graph } from "./sigma/Graph.js";

import { categories } from "../../infra/data/categories.js";

window.onload = async () => {
	const graph = await Graph();

	categories.nodes.forEach((node) => {
		graph.renderNode(node);
	});
};
