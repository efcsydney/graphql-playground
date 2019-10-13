process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const qs = require("querystring");
const fetch = require("node-fetch");
const API_URL =
  "https://qa-efc-roster-818058906.ap-southeast-2.elb.amazonaws.com/api/";

module.exports = {
  Query: {
    events: (_, args) =>
      fetch(`${API_URL}events?${qs.stringify({ ...args })}`)
        .then(response => response.json())
        .then(data => data.data)
        .catch(e => {
          throw new Error(e);
        }),
    services: (_, args) =>
      fetch(`${API_URL}services?${qs.stringify({ ...args })}`)
        .then(response => response.json())
        .then(data => data.data)
        .catch(e => {
          throw new Error(e);
        }),
    service: (_, args) =>
      fetch(`${API_URL}services?${args.id}`)
        .then(response => response.json())
        .then(data => data.data)
        .catch(e => {
          throw new Error(e);
        })
  },
  Event: {
    positions: async event => {
      const services = await fetch(`${API_URL}services`)
        .then(response => response.json())
        .then(data => data.data)
        .catch(e => {
          throw new Error(e);
        });
      const service = services.find(
        service => service.name === event.serviceInfo.category
      );
      return service.positions;
    }
  },
  Mutation: {
    modifyEvent: (_, args) => {
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
      return fetch(`${API_URL}events`, {
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
};
