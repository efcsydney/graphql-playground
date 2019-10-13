const fetch = require("node-fetch");
const queryString = require("query-string");
const {
  buildSchema,
  GraphQLSchema,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLBoolean
} = require("graphql");

const schema = buildSchema(`
  # The root query type
  type Query {
    events(category: String, from: String, to: String): [Event]
  }

  # The meta data for a day
  type ServiceInfo {
    id: Int
    footnote: String
    skipService: Boolean
    skipReason: String
    date: String
    category: String
  }

  # A day in a service
  type Event {
    id: Int
    date: String
    serviceInfo: ServiceInfo
  }
`);

// Information about how to get the data
module.exports = schema;
