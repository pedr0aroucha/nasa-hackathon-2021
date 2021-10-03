import { Handlers } from "./Handlers.js";

export async function Graph() {
	function _init() {
		return new Promise((resolve) => {
			sigma.parsers.json(
				"../../../infra/data/sigma.json",
				{
					container: "graph-container",
					settings: {
						defaultLabelColor: "#fff",
						defaultLabelSize: 20,
						minNodeSize: 10,
						maxNodeSize: 15,
					},
				},
				function (s) {
					const handlers = Handlers();

					handlers.clickNode(s);
					handlers.doubleClickNode(s);
					handlers.overNode(s);
					handlers.whenSearchingInWriting(s);

					resolve(s);
				},
			);
		});
	}

	const sigmaCanva = await _init();

	function renderNode(node) {
		if (!node.x) node.x = Math.random();
		if (!node.y) node.y = Math.random();
		if (!node.size) node.size = 10;
		if (!node.color) node.color = "#99d98c";

		sigmaCanva.graph.addNode(node);
		sigmaCanva.refresh();
	}

	function renderEdge(edge) {
		sigmaCanva.graph.addEdge(edge);
		sigmaCanva.refresh();
	}

	return {
		renderNode,
		renderEdge,
		_init,
	};
}
