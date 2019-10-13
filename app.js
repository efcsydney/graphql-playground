const express = require("express");
const graphqlHttp = require("express-graphql");
const app = express();
const fetch = require("node-fetch");
const schema = require("./schema");

app.get("/", async (req, res) => {
  const url =
    "https://roster.efcsydney.org/api/events?category=english&from=2018-04-01&to=2018-06-30";
  const response = await fetch(url)
    .then(response => response.json())
    .then(data => {
      res.send(JSON.stringify(data.data));
    });
});

app.use("/graphql", graphqlHttp({ schema, graphiql: true }));

app.listen(process.env.PORT || 3000, () =>
  console.log("Example app listening on port 3000!")
);
