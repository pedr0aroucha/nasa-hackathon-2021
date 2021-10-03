export function applyCategoryFilter(event, filter) {
	var category = event.target[event.target.selectedIndex].value;
	filter
		.undo("node-category")
		.nodesBy(function (node) {
			return !category.length || node.category === category;
		}, "node-category")
		.apply();
}
