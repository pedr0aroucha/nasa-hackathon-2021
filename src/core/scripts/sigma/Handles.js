import { Search } from "./Search.js";
import { Graph } from "./Graph.js";
// animations
import { Loading } from "../animations/Loading.js";
// utils
import { getUrlParams } from "../utils/getUrlParams.js";
// infra/data
import { categories } from "../../../infra/data/categories.js";

function clickNode(sigmaCanva, degree = "category") {
	sigmaCanva.bind("clickNode", async function (event) {
		const loading = Loading();
		const search = Search();
		const graph = await Graph();

		loading.start();
		sigmaCanva.graph.clear();

		const categoryLabel = event.data.node.label;
		const categoryString = String(categoryLabel)
			.toLowerCase()
			.replace(" ", "-")
			.replace("/", "-");

		const category = categories.nodes.filter(
			(category) =>
				(category.label =
					categoryLabel && category.category == categoryLabel),
		)[0];

		if (!category) return;

		category.color = "#4361ee";
		category.x = null;
		category.y = null;

		console.log(category);

		let urlParams = "categories.html";

		if (degree == "category") urlParams += `?filter=${categoryString}`;
		else if (degree == "subcategory") {
			urlParams += `?filter=${getUrlParams(
				"filter",
			)}&subcategory=${categoryString}`;
		}

		window.history.pushState(null, null, urlParams);

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
				edges.push({
					id: term.id,
					source: term.id,
					target: category.id,
					type: "arrow",
				});
			});

		// console.log({ terms, words, imagesAndVideos });

		nodes.forEach((node) => {
			graph.renderNode(node);
		});

		edges.forEach((edge) => {
			graph.renderEdge(edge);
		});

		sigmaCanva.refresh();
		loading.stop();
	});
}

export function Handles() {
	return {
		clickNode,
	};
}
