import { Search } from "./Search.js";
import { Graph } from "./Graph.js";
import { renderSubNodes } from "./renderSubNodes.js";
// animations
import { Loading } from "../animations/Loading.js";

function clickNode(sigmaCanva) {
	sigmaCanva.bind("clickNode", async function (event) {
		const node = event.data.node;

		const categoryLabel = node.label;
		const category = node.category;

		const selectedNode = document.getElementById("selected-node");

		if (node.not_clickable) return;

		selectedNode.innerHTML = `
			<div id="buttons-options" >
				<h5>${categoryLabel}</h5>
				<button id="see-more-related-items" >See more related items</button>

		${
			node.is_from_the_main_category || !node.link
				? ""
				: `<a href="${node.link}" target="_blank" >See about this item</a>`
		}
				<button id="go-back" onclick="window.location.replace(window.origin + window.location.pathname)" >Go back</button>
			</div>
		`;

		document.getElementById("see-more-related-items").onclick =
			async () => {
				renderSubNodes(
					sigmaCanva,
					category,
					categoryLabel,
					selectedNode,
				);
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
		if (terms?.content?.result?.results)
			terms.content.result.results.forEach((term) => {
				const id = term.id;
				const label = "📃 " + (term.title || "Untitled");
				const link = term.url;

				if (!term.url) console.log(term);

				nodes.push({
					id,
					label,
					category: "",
					link,
					type: "",
				});
			});

		if (words.content?.hits?.hits)
			words.content.hits.hits.forEach((word) => {
				const id = word._id;
				const label =
					"📃 " +
					(word._source["Project Title"] ||
						word._source["Study Title"] ||
						word._source["Study Publication Title"]);
				const link = word._source["Project Link"];

				nodes.push({
					id,
					label,
					category: "",
					link,
					type: "",
				});
			});

		if (imagesAndVideos.content?.collection?.items)
			imagesAndVideos.content?.collection?.items.forEach((media) => {
				const id = media.data[0].nasa_id;
				const label = "🎬 " + media.data[0].title;
				const link = media.links ? media.links[0].href : "";

				nodes.push({
					id,
					label,
					category: "",
					link,
				});
			});
		nodes.forEach((node, index) => {
			node.y = 0.5 + index / 10;
			node.x = 0.5;
			graph.renderNode(node);
		});

		sigmaCanva.refresh();
		loading.stop();

		selectedNode.innerHTML = `
		<div id="buttons-options" >
			<button id="go-back" onclick="window.location.replace(window.origin + window.location.pathname)" >Go back</button>
		</div>`;
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
