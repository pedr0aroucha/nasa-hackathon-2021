const express = require("express");
const morgan = require("morgan");
const { resolve } = require("path");

const app = express();

const PORT = 3000;

app.use(morgan("dev"));

app.use(express.static(resolve(__dirname)));

app.get("/json", (req, res) => {
	const jsonFile = require("./infra/data/data.json");

	return res.json(jsonFile);
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
