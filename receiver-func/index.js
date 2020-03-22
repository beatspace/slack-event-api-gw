const express = require('express');
const bodyParser = require('body-parser');
const {createEventAdapter} = require('@slack/events-api');
const {PubSub} = require('@google-cloud/pubsub');
//const slackRouter = require('./routes/slack');

const PORT = 5555;
const pubsub = new PubSub();
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//app.use('/slack', slackRouter);
app.use('/', slackEvents.requestListener());

slackEvents.on('message', async (event) => {
  console.log("---------------------->");
  console.log(JSON.stringify(event));
  const data = JSON.stringify(event);
  const buffer = Buffer.from(data);

  const messageId = await pubsub.topic(process.env.PUBSUB_TOPIC_NAME).publish(buffer);
  console.log(`Message: <${messageId}> published.`);
});

slackEvents.on('error', (error) => {
  console.log(error);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = {
  app
};
