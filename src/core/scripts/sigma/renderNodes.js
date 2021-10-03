export function renderNodes(jsonUrl) {
	/**
	 * This is an example on how to use sigma filters plugin on a real-world graph.
	 */
	var filter;

	/**
	 * DOM utility functions
	 */
	var _ = {
		$: function (id) {
			return document.getElementById(id);
		},

		all: function (selectors) {
			return document.querySelectorAll(selectors);
		},

		removeClass: function (selectors, cssClass) {
			var nodes = document.querySelectorAll(selectors);
			var l = nodes.length;
			for (i = 0; i < l; i++) {
				var el = nodes[i];
				// Bootstrap compatibility
				el.className = el.className.replace(cssClass, "");
			}
		},

		addClass: function (selectors, cssClass) {
			var nodes = document.querySelectorAll(selectors);
			var l = nodes.length;
			for (i = 0; i < l; i++) {
				var el = nodes[i];
				// Bootstrap compatibility
				if (-1 == el.className.indexOf(cssClass)) {
					el.className += " " + cssClass;
				}
			}
		},

		show: function (selectors) {
			this.removeClass(selectors, "hidden");
		},

		hide: function (selectors) {
			this.addClass(selectors, "hidden");
		},

		toggle: function (selectors, cssClass) {
			var cssClass = cssClass || "hidden";
			var nodes = document.querySelectorAll(selectors);
			var l = nodes.length;
			for (i = 0; i < l; i++) {
				var el = nodes[i];
				//el.style.display = (el.style.display != 'none' ? 'none' : '' );
				// Bootstrap compatibility
				if (-1 !== el.className.indexOf(cssClass)) {
					el.className = el.className.replace(cssClass, "");
				} else {
					el.className += " " + cssClass;
				}
			}
		},
	};

	function updatePane(graph, filter) {
		// get max degree
		var maxDegree = 0,
			categories = {};

		// read nodes
		graph.nodes().forEach(function (n) {
			maxDegree = Math.max(maxDegree, graph.degree(n.id));
			categories[n.category] = true;
		});

		// node category
		var nodecategoryElt = _.$("node-category");
		Object.keys(categories).forEach(function (c) {
			var optionElt = document.createElement("option");
			optionElt.text = c;
			nodecategoryElt.add(optionElt);
		});

		// reset button
		_.$("reset-btn").addEventListener("click", function (e) {
			_.$("node-category").selectedIndex = 0;
			filter.undo().apply();
			_.$("dump").textContent = "";
			_.hide("#dump");
		});

		// export button
		_.$("export-btn").addEventListener("click", function (e) {
			var chain = filter.export();
			console.log(chain);
			_.$("dump").textContent = JSON.stringify(chain);
			_.show("#dump");
		});
	}

	sigma.parsers.json(
		jsonUrl,
		{
			container: "graph-container",
			settings: {
				defaultLabelColor: "#fff",
				defaultLabelSize: 20,
			},
		},
		function (s) {
			filter = new sigma.plugins.filter(s);

			console.log(s, s.graph.nodes());

			// s.refresh();

			updatePane(s.graph, filter);

			function applyCategoryFilter(e) {
				console.log(e.target.value);

				var c = e.target[e.target.selectedIndex].value;
				filter
					.undo("node-category")
					.nodesBy(function (n) {
						return !c.length || n.category === c;
					}, "node-category")
					.apply();
			}

			_.$("node-category").addEventListener(
				"change",
				applyCategoryFilter,
			);
		},
	);
}
