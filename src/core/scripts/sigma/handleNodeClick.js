import { Search } from "./Search.js";
import { Loading } from "../animations/Loading.js";

export function handleNodeClick(sigma) {
	sigma.bind("clickNode", async function (event) {
		const search = Search();

		Loading().start();

		document.getElementById("node-category").value = event.data.node.label;

		const categoryString = String(event.data.node.label)
			.toLowerCase()
			.replace(" ", "-")
			.replace("/", "-");

		window.history.pushState(null, null, `?filter=${categoryString}`);

		const terms = await search.searchByTerm(categoryString);
		const words = await search.searchByWord(categoryString);
		const imagesAndVideos = await search.searchByImagesAndVideos(
			categoryString,
		);

		console.log({ terms, words, imagesAndVideos });

		Loading().stop();
	});
}
