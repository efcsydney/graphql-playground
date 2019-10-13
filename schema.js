const { gql } = require("apollo-server");

const typeDefs = gql`
  # The root query type
  type Query {
    events(category: String, from: String, to: String): [Event]!
    services: [Service]!
    service(id: Int): Service
  }

  type Service {
    id: ID
    name: String
    locale: String
    label: String
    footnoteLabel: String
    frequency: String
    positions: [Position]
  }

  type Position {
    id: ID
    name: String
    order: Int
    serviceId: String
    createdAt: String
    updatedAt: String
  }

  # The meta data for a day
  type ServiceInfo {
    id: ID
    footnote: String
    skipService: Boolean
    skipReason: String
    date: String
    category: String
  }

  # A day in a service
  type Event {
    id: ID
    date: String
    serviceInfo: ServiceInfo
    positions: [Position]
  }
`;

// Information about how to get the data
module.exports = typeDefs;
