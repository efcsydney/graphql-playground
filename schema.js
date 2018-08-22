const fetch = require("node-fetch");
const queryString = require("query-string");
const {
  GraphQLSchema,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLBoolean
} = require("graphql");

const ServiceInfoType = new GraphQLObjectType({
  name: "ServiceInfo",
  description: "The meta data for a day",
  fields: {
    id: { type: GraphQLInt },
    footnote: { type: GraphQLString },
    skipService: { type: GraphQLBoolean },
    skipReason: { type: GraphQLString },
    date: { type: GraphQLString },
    category: { type: GraphQLString }
  }
});

const EventType = new GraphQLObjectType({
  name: "Event",
  description: "A day in a service",
  fields: () => ({
    id: {
      type: GraphQLInt
    },
    date: {
      type: GraphQLString
    },
    serviceInfo: {
      type: ServiceInfoType
    }
  })
});

// Information about how to get the data
module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    description: "The root query type",
    fields: () => ({
      events: {
        type: new GraphQLList(EventType),
        args: {
          category: { type: GraphQLString },
          from: { type: GraphQLString },
          to: { type: GraphQLString }
        },
        resolve: (root, args) => {
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
      }
    })
  })
});
