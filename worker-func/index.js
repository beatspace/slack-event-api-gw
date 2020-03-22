const MessageHandler = require('./message_handler');
const msgHandler = new MessageHandler();

exports.helloPubSub = async (pubSubEvent, context) => {
    await msgHandler.handle(pubSubEvent, context);
};
