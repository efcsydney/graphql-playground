const qs = require("querystring");
const fetch = require("node-fetch");
const API_URL = "https://roster.efcsydney.org/api/";

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
  }
};
