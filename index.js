const express = require("express");
const app = express();
const port = 5500;
const cors = require("cors");

const routes = require("./routes/route");

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
