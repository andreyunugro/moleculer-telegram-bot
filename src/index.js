const { MoleculerError } = require('moleculer').Errors;
const TelegramBot = require('node-telegram-bot-api');

require('dotenv').config();

module.exports = function createService() {
  const sendOptions = {
    parse_mode: { type: 'string', optional: true, enum: ['Markdown', 'MarkdownV2', 'HTML'] },
    caption: { type: 'string', optional: true },
    disable_notification: { type: 'boolean', optional: true },
    reply_to_message_id: { type: 'number', optional: true },
    reply_markup: { type: 'any', optional: true },
    fileOpts: {
      type: 'object',
      optional: true,
      strict: 'remove',
      props: {
        filename: { type: 'string', optional: true },
        contentType: { type: 'string', optional: true },
      },
    },
  };
  const service = {
    name: 'telegram',

    settings: {
      telegramToken: process.env.TELEGRAM_TOKEN,
    },

    actions: {
      sendMessage: {
        params: {
          to: [{ type: 'string' }, { type: 'number' }],
          message: 'string',
          parse_mode: { type: 'string', optional: true, enum: ['Markdown', 'MarkdownV2', 'HTML'] },
          disable_web_page_preview: { type: 'boolean', optional: true },
          disable_notification: { type: 'boolean', optional: true },
          reply_to_message_id: { type: 'number', optional: true },
          reply_markup: { type: 'any', optional: true },
        },
        handler({ params }) {
          // Build the send message opts.
          const { to, message, ...opts } = params;
          return this.sendMessage(to, message, opts);
        },
      },

      sendPhoto: {
        params: {
          to: [{ type: 'string' }, { type: 'number' }],
          photo: 'string',
          ...sendOptions,
        },
        handler({ params }) {
          // Currently only support send photo as string URL.
          const {
            to, photo, fileOpts, ...opts
          } = params;
          return this.sendPhoto(to, photo, opts, fileOpts);
        },
      },

      sendDocument: {
        params: {
          to: [{ type: 'string' }, { type: 'number' }],
          doc: 'string',
          ...sendOptions,
        },
        handler({ params }) {
          // Currently only support send document as string URL.
          const {
            to, doc, fileOpts, ...opts
          } = params;
          return this.sendDocument(to, doc, opts, fileOpts);
        },
      },
    },

    methods: {
      /**
       * Send a message
       * @param {String|Number} to Message target.
       * @param {String} message Body of the message.
       * @param {TelegramBot.SendMessageOptions} opts Send message options.
       * @returns {Promise<TelegramBot.Message>} Message when success.
       */
      async sendMessage(to, message, opts) {
        this.logger.debug(`Sending message to "${to}".`);
        try {
          const result = await this.bot.sendMessage(to, message, opts);
          this.logger.debug(`The Message sent to "${to}" successfully.`);
          return result;
        } catch (err) {
          // https://github.com/yagop/node-telegram-bot-api/blob/master/doc/usage.md#error-handling
          const error = new MoleculerError(`${err.message}`, 500, 'SENDMESSAGE_ERROR', err.response.body);
          return this.Promise.reject(error);
        }
      },

      /**
       * Send a Photo
       * @param {String|Number} to Message target.
       * @param {String|Stream|Buffer} photo Photo to send.
       * @param {TelegramBot.SendPhotoOptions} opts Send photo options.
       * @param {TelegramBot.fileOpts} fileOpts Send photo file options.
       * @returns {TelegramBot.Message} Message when success.
       */
      async sendPhoto(to, photo, opts, fileOpts) {
        this.logger.debug(`Sending photo to "${to}".`);
        try {
          const result = await this.bot.sendPhoto(to, photo, opts, fileOpts);
          this.logger.debug(`The photo send to "${to}" successfully.`);
          return result;
        } catch (err) {
          const error = new MoleculerError(`${err.message}`, 500, 'SENDPHOTO_ERROR', err.response.body);
          return this.Promise.reject(error);
        }
      },

      /**
       * Send a Document
       * @param {String|Number} to Message target.
       * @param {String|Stream|Buffer} doc Document to send.
       * @param {TelegramBot.SendDocumentOptions} opts Send document options.
       * @param {TelegramBot.fileOpts} fileOpts Send document file options.
       * @returns {TelegramBot.Message} Message when success.
       */
      async sendDocument(to, doc, opts, fileOpts) {
        this.logger.debug(`Sending document to "${to}".`);
        try {
          const result = await this.bot.sendDocument(to, doc, opts, fileOpts);
          this.logger.debug(`The document send to "${to}" successfully.`);
          return result;
        } catch (err) {
          const error = new MoleculerError(`${err.message}`, 500, 'SENDDOCUMENT_ERROR', err.response.body);
          return this.Promise.reject(error);
        }
      },
    },

    created() {
      if (typeof this.settings.telegramToken === 'undefined') {
        this.logger.warn("The 'telegramToken' is not configured. Please set the 'TELEGRAM_TOKEN' environment variable!");
      }
    },

    started() {
      this.bot = new TelegramBot(this.settings.telegramToken);
      return this.Promise.resolve();
    },

    stopped() {
      return this.Promise.resolve();
    },
  };
  return service;
};
