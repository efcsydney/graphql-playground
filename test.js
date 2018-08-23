const express = require("express");
const graphqlHttp = require("express-graphql");
const app = express();
const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type Video {
    id: ID
    title: String
    duration: Int
    watched: Boolean
  }
  type Query {
    video: Video
    videos: [Video]
  }
  type Schema {
    query: Query
  }
`);

const videoA = {
  id: "1",
  title: "Create a GraphQL schema",
  duration: 120,
  watched: true
};
const videoB = {
  id: "2",
  title: "Ember.js CLI",
  duration: 240,
  watched: false
};
const videos = [videoA, videoB];

const resolvers = {
  video: () => videoA,
  videos: () => videos
};

const query = `
  query {
    videos {
      id,
      title
    }
  }
`;

// graphql(schema, query, resolvers)
//   .then(result => {
//     result;
//     console.log(result.data.videos);
//   })
//   .catch(e => console.log(e));

app.use(
  "/graphql",
  graphqlHttp({ schema, graphiql: true, rootValue: resolvers })
);

app.listen(process.env.PORT || 3000, () =>
  console.log("Example app listening on port 3000!")
);
