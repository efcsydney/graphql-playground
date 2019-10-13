const { gql } = require("apollo-server");

const typeDefs = gql`
  directive @deprecated(
    reason: String = "No longer supported"
  ) on FIELD_DEFINITION | ENUM_VALUE

  """
  The root query type
  """
  type Query {
    events(category: String, from: String, to: String): [Event]!
    services: [Service]!
    service(id: Int): Service
  }

  """
  The service category (e.g. Sunday Service, or Prayer's Meeting)
  """
  type Service {
    id: ID
    name: String
    locale: String
    label: String
    footnoteLabel: String
    frequency: String
    positions: [Position]
  }

  """
  The position (e.g. Speaker or Pianist)
  """
  type Position {
    id: ID
    name: String
    """
    Displaying order
    """
    order: Int
    serviceId: String
    createdAt: String
    updatedAt: String
  }

  """
  The meta data for a day
  """
  type ServiceInfo {
    id: ID
    footnote: String
    skipService: Boolean
    skipReason: String
    date: String
    category: String
  }

  """
  A day in a service
  """
  type Event {
    id: ID
    date: String @deprecated(reason: "Use dateString")
    dateString: String
    serviceInfo: ServiceInfo
    positions: [Position]
    # All volunteers for this day
    members: [Member]
  }

  # A volunteer
  type Member {
    role: String
    name: String
    serviceInfo: ServiceInfo
  }

  type Mutation {
    modifyEvent(
      """
      The day ID
      """
      id: ID!
      """
      The YYYY-MM-DD format of date
      """
      date: String
      """
      The name of volunteer
      """
      name: String
      """
      The role which volunteer plays
      """
      role: String
    ): Event
  }
`;

module.exports = typeDefs;
