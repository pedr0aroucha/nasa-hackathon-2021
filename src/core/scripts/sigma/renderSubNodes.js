import { Search } from "./Search.js";
import { Graph } from "./Graph.js";
// animations
import { Loading } from "../animations/Loading.js";
// utils
import { getUrlParams } from "../utils/getUrlParams.js";
// infra/data
import { categories } from "../../../infra/data/categories.js";

export async function renderSubNodes(sigmaCanva, categoryLabel, selectedNode) {
	const search = Search();
	const loading = Loading();
	const graph = await Graph();

	const categoryString = String(categoryLabel)
		.toLowerCase()
		.replace(" ", "-")
		.replace("/", "-");

	const categoryFilter = getUrlParams("filter") || categoryLabel;

	const category = categories.nodes.filter(
		(category) =>
			category.label == categoryFilter &&
			category.category == categoryFilter,
	)[0];

	loading.start();
	sigmaCanva.graph.clear();

	if (category) {
		category.color = "#4361ee";
		category.x = -0.5;
		category.y = 0;
	}

	const nodes = [category];
	const edges = [];

	const terms = await search.searchByTerm(categoryString);
	const words = await search.searchByWord(categoryString);
	const imagesAndVideos = await search.searchByImagesAndVideos(
		categoryString,
	);

	if (terms.content)
		terms.content.result.results.forEach((term) => {
			nodes.push({
				id: term.id,
				label: term.title,
				image: "https://github.com/pedr0aroucha.png",
				category: categoryLabel,
			});
			if (category)
				edges.push({
					id: term.id,
					source: term.id,
					target: category.id,
					type: "arrow",
				});
		});

	nodes.forEach((node, index) => {
		if (!node) return;
		if (index) {
			node.y = 0.5 + index / 10;
			node.x = 0.1;
		}

		graph.renderNode(node);
	});

	if (category)
		edges.forEach((edge) => {
			if (!edge) return;
			graph.renderEdge(edge);
		});

	sigmaCanva.refresh();
	loading.stop();

	selectedNode.innerText = "Voltar";
	selectedNode.onclick = () => {
		window.location.replace(window.origin + window.location.pathname);
	};
}
