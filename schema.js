const fetch = require("node-fetch");
const queryString = require("query-string");
const {
  GraphQLSchema,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull
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

const MemberType = new GraphQLObjectType({
  name: "Member",
  description: "A volunteer",
  fields: () => ({
    role: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    serviceInfo: {
      type: ServiceInfoType
    }
  })
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
    members: {
      type: new GraphQLList(MemberType),
      title: "All volunteers for this day"
    },
    serviceInfo: {
      type: ServiceInfoType
    }
  })
});

const QueryType = new GraphQLObjectType({
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
        return fetch(`https://demo-roster.efcsydney.org/api/events?${query}`)
          .then(response => response.json())
          .then(data => data.data)
          .catch(e => {
            throw new Error(e);
          });
      }
    }
  })
});

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "The root mutation type",
  fields: () => ({
    modifyEvent: {
      type: EventType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLInt),
          title: "The day ID"
        },
        date: {
          type: new GraphQLNonNull(GraphQLString),
          title: "The YYYY-MM-DD format of date"
        },
        name: {
          type: new GraphQLNonNull(GraphQLString),
          title: "The name of volunteer"
        },
        role: {
          type: new GraphQLNonNull(GraphQLString),
          title: "The role which volunteer plays"
          // },
          // serviceInfo: {
          //   type: ServiceInfoType,
          //   title: "The related meta data"
        }
      },
      resolve: (root, args) => {
        const body = JSON.stringify({
          date: args.date,
          name: args.name,
          role: args.role,
          serviceInfo: {
            category: "english",
            date: args.date,
            footnote: "",
            id: args.id,
            skipReason: "",
            skipService: false
          }
        });
        return fetch(`https://demo-roster.efcsydney.org/api/events`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body
        })
          .then(response => response.json())
          .then(data => {
            return data.data;
          })
          .catch(e => {
            throw new Error(e);
          });
      }
    }
  })
});

// Information about how to get the data
module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
});
