import { Search } from "./Search.js";
import { Graph } from "./Graph.js";
import { renderSubNodes } from "./renderSubNodes.js";
// animations
import { Loading } from "../animations/Loading.js";

function clickNode(sigmaCanva) {
	sigmaCanva.bind("clickNode", async function (event) {
		const selectedNode = document.getElementById("selected-node");
		const categoryLabel = event.data.node.label;

		if (event.data.node.not_clickable) return;

		selectedNode.innerText = categoryLabel;

		selectedNode.onclick = async () => {
			renderSubNodes(sigmaCanva, categoryLabel, selectedNode);
		};
	});
}

function doubleClickNode(sigmaCanva) {
	sigmaCanva.bind("doubleClickNode", async function (event) {
		const categoryLabel = event.data.node.label;

		console.log(categoryLabel);
	});
}

function overNode(sigmaCanva) {
	sigmaCanva.bind("overNode", async function (event) {
		const categoryLabel = event.data.node.label;
	});
}

function whenSearchingInWriting(sigmaCanva) {
	document.getElementById("button-search-send").onclick = async () => {
		const search = Search();
		const loading = Loading();
		const graph = await Graph();

		const selectedNode = document.getElementById("selected-node");

		loading.start();
		sigmaCanva.graph.clear();

		const input = document.getElementById("input-search");

		const categoryLabel = input.value;

		const categoryString = String(categoryLabel)
			.toLowerCase()
			.replace(" ", "-")
			.replace("/", "-");

		const nodes = [];

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
			});

		nodes.forEach((node, index) => {
			node.y = 0.5 + index / 10;
			node.x = 0.5;
			graph.renderNode(node);
		});

		sigmaCanva.refresh();
		loading.stop();

		selectedNode.innerText = "Voltar";
		selectedNode.onclick = () => {
			window.location.replace(window.origin + window.location.pathname);
		};
	};
}

export function Handlers() {
	return {
		clickNode,
		doubleClickNode,
		overNode,
		whenSearchingInWriting,
	};
}
