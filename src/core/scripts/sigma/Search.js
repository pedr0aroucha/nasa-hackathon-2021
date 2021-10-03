import { Api } from "../../../infra/api/Api.js";

const api = Api();

async function searchByTerm(term) {
	return await api.GET(`/catalog/${term}`);
}

async function searchByProjects() {
	return await api.GET("/techport");
}

async function searchByWord(word) {
	return await api.GET(`/search/${word}`);
}

async function searchByImagesAndVideos(term) {
	return await api.GET(`image-video-search/${term}`);
}

export function Search() {
	return {
		searchByTerm,
		searchByProjects,
		searchByWord,
		searchByImagesAndVideos,
	};
}
