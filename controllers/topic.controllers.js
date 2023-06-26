const { selectTopics } = require("../models/topic.models.js");

exports.getAllTopics = (_, res) => {
  return selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
