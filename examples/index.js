const { ServiceBroker } = require('moleculer');
const TelegramService = require('../index');

// Create broker
const broker = new ServiceBroker({
  logger: console,
  logLevel: 'debug',
});

require('dotenv').config();

// Load my service
broker.createService({
  name: 'telegram',
  mixins: [TelegramService()],
  // Alternative:
  // mixins: [TelegramService({ token: '', target: '' })],
  settings: {
    telegramToken: process.env.TELEGRAM_TOKEN,
    telegramTarget: process.env.TELEGRAM_TARGET,
  },
});

// Start server
broker.start().then(() => {
  // Call action
  broker
    .call('telegram.sendMessage', {
      message: 'Hello Telegram!',
    })
    .then((res) => broker.logger.info('Res:', res))
    .catch(broker.logger.error);
});
