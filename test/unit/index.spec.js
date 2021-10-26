const { ServiceBroker } = require('moleculer');
const { MoleculerError } = require('moleculer').Errors;
const TelegramBot = require('node-telegram-bot-api');
const TelegramService = require('../../src');

jest.mock('node-telegram-bot-api');

describe('Test Telegram service', () => {
  // Define service broker to use for all test.
  const broker = new ServiceBroker({ logger: false });
  // Make sure that log get mocked.
  const fakeLog = {
    debug: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  };
  const mockGetLogger = jest.spyOn(broker, 'getLogger')
    .mockImplementation(() => fakeLog);
  // Provide several test variables.
  const token = 'xxx';
  const sampleMessage = {};
  const errorMessage = 'errorTest';
  const error = new Error(errorMessage);
  error.code = 'ETELEGRAM';
  error.response = { body: 'error' };
  // Create mock for telegram send*.
  const sendMock = jest.fn()
    .mockImplementation((to) => {
      if (to === 'valid' || to === 'env' || to === 'target' || to === 123) {
        return Promise.resolve(sampleMessage);
      }
      return Promise.reject(error);
    });

  TelegramBot.mockImplementation(() => ({
    sendMessage: sendMock,
    sendPhoto: sendMock,
    sendDocument: sendMock,
  }));

  beforeAll(() => {
    // Check whether TELEGRAM_TOKEN is defined.
    if (typeof process.env.TELEGRAM_TOKEN !== 'undefined') {
      delete process.env.TELEGRAM_TOKEN;
    }
    // Check whether TELEGRAM_TARGET is defined.
    if (typeof process.env.TELEGRAM_TARGET !== 'undefined') {
      delete process.env.TELEGRAM_TARGET;
    }
  });

  beforeEach(() => {
    mockGetLogger.mockClear();
    fakeLog.warn.mockClear();
    sendMock.mockClear();
    TelegramBot.mockClear();
  });

  it('should created and log warn when no telegramToken configured', () => {
    // Without telegramToken, should log warn.
    const serviceWarn = broker.createService(TelegramService());
    expect(serviceWarn).toBeDefined();
    expect(mockGetLogger).toHaveBeenCalledTimes(1);
    expect(fakeLog.warn).toHaveBeenCalledWith("The 'telegramToken' is not configured. Please set the 'TELEGRAM_TOKEN' environment variable!");
    broker.destroyService(serviceWarn);
  });

  it('should be created properly', () => {
    process.env.TELEGRAM_TOKEN = token;
    const service = broker.createService(TelegramService());
    expect(service).toBeDefined();
    expect(service.bot).not.toBeDefined();
    expect(mockGetLogger).toHaveBeenCalledTimes(1);
    expect(fakeLog.warn).not.toHaveBeenCalled();
    broker.destroyService(service);
    delete process.env.TELEGRAM_TOKEN;
  });

  it('should started properly with token from env', async () => {
    process.env.TELEGRAM_TOKEN = token;
    const service = broker.createService(TelegramService());
    await broker.start();
    expect(TelegramBot).toHaveBeenCalledTimes(1);
    expect(TelegramBot).toHaveBeenCalledWith(token);
    expect(service.bot).toBeDefined();
    expect(service.sendMessage).toBeDefined();
    expect(service.sendPhoto).toBeDefined();
    expect(service.sendDocument).toBeDefined();
    await broker.stop();
    broker.destroyService(service);
    delete process.env.TELEGRAM_TOKEN;
  });

  it('should started properly with token from service options', async () => {
    const service = broker.createService(TelegramService({ token }));
    await broker.start();
    expect(TelegramBot).toHaveBeenCalledTimes(1);
    expect(TelegramBot).toHaveBeenCalledWith(token);
    expect(service.bot).toBeDefined();
    expect(service.sendMessage).toBeDefined();
    expect(service.sendPhoto).toBeDefined();
    expect(service.sendDocument).toBeDefined();
    await broker.stop();
    broker.destroyService(service);
  });

  describe('sendMessage', () => {
    it('should call bot.sendMessage', async () => {
      const service = broker.createService(TelegramService({ token }));
      await broker.start();
      const result = await service.sendMessage(123, 'message');
      expect(service.bot.sendMessage).toHaveBeenCalledTimes(1);
      expect(result).toBe(sampleMessage);
      await broker.stop();
      broker.destroyService(service);
    });

    it('should call bot.sendMessage and return with error', async () => {
      const service = broker.createService(TelegramService({ token }));
      await broker.start();
      await expect(service.sendMessage('')).rejects.toThrow(new MoleculerError(`${error.message}`, 500, 'SENDMESSAGE_ERROR', error.response.body));
      expect(service.bot.sendMessage).toHaveBeenCalledTimes(1);
      await broker.stop();
      broker.destroyService(service);
    });

    it('should call the sendMessage with error', async () => {
      const service = broker.createService(TelegramService({ token }));
      await broker.start();
      service.sendMessage = sendMock;
      await expect(broker.call('telegram.sendMessage', { message: 'test' })).rejects.toThrow(error);
      expect(service.sendMessage).toHaveBeenCalledTimes(1);
      expect(service.sendMessage).toHaveBeenCalledWith(undefined, 'test', {});
      await broker.stop();
      broker.destroyService(service);
    });

    it('should call the sendMessage with validation error', async () => {
      const service = broker.createService(TelegramService({ token }));
      await broker.start();
      service.sendMessage = sendMock;
      await expect(broker.call('telegram.sendMessage', { to: [], message: 'test' })).rejects.toThrow(new Error('Parameters validation error!'));
      expect(service.sendMessage).not.toHaveBeenCalled();
      await broker.stop();
      broker.destroyService(service);
    });

    it('should call the sendMessage method successfully with to params', async () => {
      const service = broker.createService(TelegramService({ token }));
      await broker.start();
      service.sendMessage = sendMock;
      const res = await broker.call('telegram.sendMessage', { to: 'valid', message: 'test' });
      expect(res).toBe(sampleMessage);
      expect(service.sendMessage).toHaveBeenCalledTimes(1);
      expect(service.sendMessage).toHaveBeenCalledWith('valid', 'test', {});
      await broker.stop();
      broker.destroyService(service);
    });

    it('should call the sendMessage method successfully with target', async () => {
      const service = broker.createService(TelegramService({ token, target: 'target' }));
      await broker.start();
      service.sendMessage = sendMock;
      const res = await broker.call('telegram.sendMessage', { message: 'test' });
      expect(res).toBe(sampleMessage);
      expect(service.sendMessage).toHaveBeenCalledTimes(1);
      expect(service.sendMessage).toHaveBeenCalledWith('target', 'test', {});
      await broker.stop();
      broker.destroyService(service);
    });

    it('should sendMessage with default env target', async () => {
      process.env.TELEGRAM_TARGET = 'env';
      const service = broker.createService(TelegramService({ token }));
      await broker.start();
      service.sendMessage = sendMock;
      const res = await broker.call('telegram.sendMessage', { message: 'test' });
      expect(res).toBe(sampleMessage);
      expect(service.sendMessage).toHaveBeenCalledTimes(1);
      expect(service.sendMessage).toHaveBeenCalledWith('env', 'test', {});
      await broker.stop();
      broker.destroyService(service);
      delete process.env.TELEGRAM_TARGET;
    });
  });

  describe('sendPhoto', () => {
    it('should call bot.sendPhoto', async () => {
      const service = broker.createService(TelegramService({ token }));
      await broker.start();
      const result = await service.sendPhoto(123, 'photo');
      expect(service.bot.sendPhoto).toHaveBeenCalledTimes(1);
      expect(result).toBe(sampleMessage);
      await broker.stop();
      broker.destroyService(service);
    });

    it('should call bot.sendPhoto and return with error', async () => {
      const service = broker.createService(TelegramService({ token }));
      await broker.start();
      await expect(service.sendPhoto('')).rejects.toThrow(new MoleculerError(`${error.message}`, 500, 'SENDPHOTO_ERROR', error.response.body));
      expect(service.bot.sendPhoto).toHaveBeenCalledTimes(1);
      await broker.stop();
      broker.destroyService(service);
    });

    it('should call the sendPhoto with error', async () => {
      const service = broker.createService(TelegramService({ token }));
      await broker.start();
      service.sendPhoto = sendMock;
      await expect(broker.call('telegram.sendPhoto', { photo: 'test' })).rejects.toThrow(error);
      expect(service.sendPhoto).toHaveBeenCalledTimes(1);
      expect(service.sendPhoto).toHaveBeenCalledWith(undefined, 'test', {}, undefined);
      await broker.stop();
      broker.destroyService(service);
    });

    it('should call the sendPhoto with validation error', async () => {
      const service = broker.createService(TelegramService({ token }));
      await broker.start();
      service.sendPhoto = sendMock;
      await expect(broker.call('telegram.sendPhoto', { to: [], photo: 'test' })).rejects.toThrow(new Error('Parameters validation error!'));
      expect(service.sendPhoto).not.toHaveBeenCalled();
      await broker.stop();
      broker.destroyService(service);
    });

    it('should call the sendPhoto method successfully', async () => {
      const service = broker.createService(TelegramService({ token }));
      await broker.start();
      service.sendPhoto = sendMock;
      const res = await broker.call('telegram.sendPhoto', { to: 'valid', photo: 'http://' });
      expect(res).toBe(sampleMessage);
      expect(service.sendPhoto).toHaveBeenCalledTimes(1);
      expect(service.sendPhoto).toHaveBeenCalledWith('valid', 'http://', {}, undefined);
      await broker.stop();
      broker.destroyService(service);
    });

    it('should call the sendPhoto method successfully with target', async () => {
      const service = broker.createService(TelegramService({ token, target: 'target' }));
      await broker.start();
      service.sendPhoto = sendMock;
      const res = await broker.call('telegram.sendPhoto', { photo: 'test' });
      expect(res).toBe(sampleMessage);
      expect(service.sendPhoto).toHaveBeenCalledTimes(1);
      expect(service.sendPhoto).toHaveBeenCalledWith('target', 'test', {}, undefined);
      await broker.stop();
      broker.destroyService(service);
    });

    it('should sendPhoto with default env target', async () => {
      process.env.TELEGRAM_TARGET = 'env';
      const service = broker.createService(TelegramService({ token }));
      await broker.start();
      service.sendPhoto = sendMock;
      const res = await broker.call('telegram.sendPhoto', { photo: 'test' });
      expect(res).toBe(sampleMessage);
      expect(service.sendPhoto).toHaveBeenCalledTimes(1);
      expect(service.sendPhoto).toHaveBeenCalledWith('env', 'test', {}, undefined);
      await broker.stop();
      broker.destroyService(service);
      delete process.env.TELEGRAM_TARGET;
    });
  });

  describe('sendDocument', () => {
    it('should call bot.sendDocument', async () => {
      const service = broker.createService(TelegramService({ token }));
      await broker.start();
      const result = await service.sendDocument(123, 'doc');
      expect(service.bot.sendDocument).toHaveBeenCalledTimes(1);
      expect(result).toBe(sampleMessage);
      await broker.stop();
      broker.destroyService(service);
    });

    it('should call bot.sendDocument and return with error', async () => {
      const service = broker.createService(TelegramService({ token }));
      await broker.start();
      await expect(service.sendDocument('')).rejects.toThrow(new MoleculerError(`${error.message}`, 500, 'SENDDOCUMENT_ERROR', error.response.body));
      expect(service.bot.sendDocument).toHaveBeenCalledTimes(1);
      await broker.stop();
      broker.destroyService(service);
    });

    it('should call the sendDocument with error', async () => {
      const service = broker.createService(TelegramService({ token }));
      await broker.start();
      service.sendDocument = sendMock;
      await expect(broker.call('telegram.sendDocument', { doc: 'test' })).rejects.toThrow(error);
      expect(service.sendDocument).toHaveBeenCalledTimes(1);
      expect(service.sendDocument).toHaveBeenCalledWith(undefined, 'test', {}, undefined);
      await broker.stop();
      broker.destroyService(service);
    });

    it('should call the sendDocument with validation error', async () => {
      const service = broker.createService(TelegramService({ token }));
      await broker.start();
      service.sendDocument = sendMock;
      await expect(broker.call('telegram.sendDocument', { to: [], doc: 'test' })).rejects.toThrow(new Error('Parameters validation error!'));
      expect(service.sendDocument).not.toHaveBeenCalled();
      await broker.stop();
      broker.destroyService(service);
    });

    it('should call the sendDocument method successfully', async () => {
      const service = broker.createService(TelegramService({ token }));
      await broker.start();
      service.sendDocument = sendMock;
      const res = await broker.call('telegram.sendDocument', { to: 'valid', doc: 'http://' });
      expect(res).toBe(sampleMessage);
      expect(service.sendDocument).toHaveBeenCalledTimes(1);
      expect(service.sendDocument).toHaveBeenCalledWith('valid', 'http://', {}, undefined);
      await broker.stop();
      broker.destroyService(service);
    });

    it('should call the sendDocument method successfully with target', async () => {
      const service = broker.createService(TelegramService({ token, target: 'target' }));
      await broker.start();
      service.sendDocument = sendMock;
      const res = await broker.call('telegram.sendDocument', { doc: 'test' });
      expect(res).toBe(sampleMessage);
      expect(service.sendDocument).toHaveBeenCalledTimes(1);
      expect(service.sendDocument).toHaveBeenCalledWith('target', 'test', {}, undefined);
      await broker.stop();
      broker.destroyService(service);
    });

    it('should sendDocument with default env target', async () => {
      process.env.TELEGRAM_TARGET = 'env';
      const service = broker.createService(TelegramService({ token }));
      await broker.start();
      service.sendDocument = sendMock;
      const res = await broker.call('telegram.sendDocument', { doc: 'test' });
      expect(res).toBe(sampleMessage);
      expect(service.sendDocument).toHaveBeenCalledTimes(1);
      expect(service.sendDocument).toHaveBeenCalledWith('env', 'test', {}, undefined);
      await broker.stop();
      broker.destroyService(service);
      delete process.env.TELEGRAM_TARGET;
    });
  });
});
