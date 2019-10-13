const express = require("express");
const graphqlHttp = require("express-graphql");
const app = express();
const fetch = require("node-fetch");
const schema = require("./schema");

app.get("/", async (req, res) => {
  const url =
    "https://stg-dev-api.whitechstage.com/config/v1/hosts/4.local.whitechstage.com:8080?languageId=1";
  const response = await fetch(url)
    .then(response => response.json())
    .then(data => res.send(JSON.stringify(data)));
});

const rootValue = {
  events: (root, args, context, info) => {
    const query = queryString.stringify({
      ...args
    });
    return fetch(`https://roster.efcsydney.org/api/events?${query}`)
      .then(response => response.json())
      .then(data => data.data)
      .catch(e => {
        throw new Error(e);
      });
  }
};

app.use("/graphql", graphqlHttp({ schema, rootValue, graphiql: true }));

app.listen(process.env.PORT || 3005, () =>
  console.log("Example app listening on port 3005!")
);
