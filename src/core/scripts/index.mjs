import { renderNodes } from "./sigma/renderNodes.js";

window.onload = () => {
	renderNodes(`${window.location.origin}/categories`);
};
