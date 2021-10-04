import { Search } from "./Search.js";
import { Graph } from "./Graph.js";
// animations
import { Loading } from "../animations/Loading.js";
// utils
import { getUrlParams } from "../utils/getUrlParams.js";
// infra/data
import { categories } from "../../../infra/data/categories.js";

export async function renderSubNodes(
	sigmaCanva,
	categoryName,
	categoryLabel,
	selectedNode,
) {
	const search = Search();
	const loading = Loading();
	const graph = await Graph();

	const categoryString = String(categoryLabel)
		.toLowerCase()
		.replace("/", "-")
		.replace(
			/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g,
			"",
		)
		.substring(1, String(categoryLabel).length)
		.replace(" ", "-");

	const categoryFilter = getUrlParams("filter") || categoryName;

	const category = categories.nodes.filter(
		(category) => category.category == categoryFilter,
	)[0];

	loading.start();
	sigmaCanva.graph.clear();

	const nodes = [category];
	const edges = [];

	const terms = await search.searchByTerm(categoryString);
	const words = await search.searchByWord(categoryString);
	const imagesAndVideos = await search.searchByImagesAndVideos(
		categoryString,
	);

	if (terms?.content?.result?.results)
		terms.content.result.results.forEach((term) => {
			const id = term.id;
			const label = "📃 " + term.title;
			const link = term.url;
			nodes.push({
				id,
				label,
				category: categoryName,
				link,
				type: "",
			});
			if (category)
				edges.push({
					id,
					source: id,
					target: category.id,
					type: "arrow",
				});
		});

	if (words.content?.hits?.hits)
		words.content.hits.hits.forEach((word) => {
			const id = word._id;
			const label = "📃 " + word._source["Study Publication Title"];
			const link = word._source["Project Link"];
			nodes.push({
				id,
				label,
				category: categoryName,
				link,
				type: "",
			});
			if (category)
				edges.push({
					id,
					source: id,
					target: category.id,
					type: "arrow",
				});
		});

	if (imagesAndVideos.content?.collection?.items)
		imagesAndVideos.content?.collection?.items.forEach((media) => {
			const id = media.data[0].nasa_id;
			const label = "🎬 " + media.data[0].title;
			const link = media.links[0].href;

			nodes.push({
				id,
				label,
				category: categoryName,
				link,
			});
			if (category)
				edges.push({
					id,
					source: id,
					target: category.id,
					type: "arrow",
				});
		});

	if (category) {
		category.color = "#4361ee";
		category.x = -10;
		category.y = nodes.length;
	}

	nodes.forEach((node, index) => {
		if (!node) return;
		if (index) {
			node.y = index * 2;
			node.x = 0.1;
			node.size = 5;
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

	selectedNode.innerHTML = `
	<div id="buttons-options" >
		<button id="go-back" onclick="window.location.replace(window.origin + window.location.pathname)" >Go back</button>
	</div>`;
}
