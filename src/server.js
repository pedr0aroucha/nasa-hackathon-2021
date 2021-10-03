const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { resolve } = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(cors());

app.use(express.static(resolve(__dirname)));

app.get("/categories", (req, res) =>
	res.json(require("./infra/data/categories.json")),
);

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
