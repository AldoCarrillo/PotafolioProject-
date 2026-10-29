const express = require("express");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("./public/assets/routes/apiRoutes")(app);
require("./public/assets/routes/htmlRoutes")(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
