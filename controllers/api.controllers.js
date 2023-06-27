const data = require("../endpoints.json");

exports.getApi = (_, res) => {
  res.status(200).send(data);
};
