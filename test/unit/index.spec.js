const { ServiceBroker } = require('moleculer');
const { MoleculerError } = require('moleculer').Errors;
const TelegramBot = require('node-telegram-bot-api');
const TelegramService = require('../../src');

jest.mock('node-telegram-bot-api');

describe('Test Telegram service', () => {
  const broker = new ServiceBroker({ logger: false });
  const fakeLog = {
    debug: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  };
  const mockGetLogger = jest.spyOn(broker, 'getLogger')
    .mockImplementation(() => fakeLog);

  const sampleMessage = {};
  const errorMessage = 'errorTest';
  const error = new Error(errorMessage);
  error.code = 'ETELEGRAM';
  error.response = { body: 'error' };
  const sendMock = jest.fn()
    .mockImplementation((to) => {
      if (to === 'valid') {
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
  });

  beforeEach(() => {
    mockGetLogger.mockClear();
    fakeLog.warn.mockClear();
    sendMock.mockClear();
  });

  const token = 'xxx';

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
    expect(mockGetLogger).toHaveBeenCalledTimes(1);
    expect(fakeLog.warn).not.toHaveBeenCalled();
    broker.destroyService(service);
  });

  it('should started properly', async () => {
    const service = broker.createService(TelegramService());
    await broker.start();
    expect(TelegramBot).toHaveBeenCalledTimes(1);
    expect(TelegramBot).toHaveBeenCalledWith(token);
    await broker.stop();
    broker.destroyService(service);
  });

  describe('sendMessage', () => {
    it('should call bot.sendMessage', async () => {
      const service = broker.createService(TelegramService());
      await broker.start();
      const result = await service.sendMessage('valid', 'message');
      expect(service.bot.sendMessage).toHaveBeenCalledTimes(1);
      expect(result).toBe(sampleMessage);
      await broker.stop();
      broker.destroyService(service);
    });

    it('should call bot.sendMessage and return with error', async () => {
      const service = broker.createService(TelegramService());
      await broker.start();
      await expect(service.sendMessage('')).rejects.toThrow(new MoleculerError(`${error.message}`, 500, 'SENDMESSAGE_ERROR', error.response.body));
      expect(service.bot.sendMessage).toHaveBeenCalledTimes(1);
      await broker.stop();
      broker.destroyService(service);
    });

    it('should call the sendMessage method successfully', async () => {
      const service = broker.createService(TelegramService());
      await broker.start();
      service.sendMessage = sendMock;
      const res = await broker.call('telegram.sendMessage', { to: 'valid', message: 'test' });
      expect(res).toBe(sampleMessage);
      expect(service.sendMessage).toHaveBeenCalledTimes(1);
      expect(service.sendMessage).toHaveBeenCalledWith('valid', 'test', {});
      await broker.stop();
      broker.destroyService(service);
    });
  });

  describe('sendPhoto', () => {
    it('should call bot.sendPhoto', async () => {
      const service = broker.createService(TelegramService());
      await broker.start();
      const result = await service.sendPhoto('valid', 'photo');
      expect(service.bot.sendPhoto).toHaveBeenCalledTimes(1);
      expect(result).toBe(sampleMessage);
      await broker.stop();
      broker.destroyService(service);
    });

    it('should call bot.sendPhoto and return with error', async () => {
      const service = broker.createService(TelegramService());
      await broker.start();
      await expect(service.sendPhoto('')).rejects.toThrow(new MoleculerError(`${error.message}`, 500, 'SENDPHOTO_ERROR', error.response.body));
      expect(service.bot.sendPhoto).toHaveBeenCalledTimes(1);
      await broker.stop();
      broker.destroyService(service);
    });

    it('should call the sendPhoto method successfully', async () => {
      const service = broker.createService(TelegramService());
      await broker.start();
      service.sendPhoto = sendMock;
      const res = await broker.call('telegram.sendPhoto', { to: 'valid', photo: 'http://' });
      expect(res).toBe(sampleMessage);
      expect(service.sendPhoto).toHaveBeenCalledTimes(1);
      expect(service.sendPhoto).toHaveBeenCalledWith('valid', 'http://', {}, undefined);
      await broker.stop();
      broker.destroyService(service);
    });
  });

  describe('sendDocument', () => {
    it('should call bot.sendDocument', async () => {
      const service = broker.createService(TelegramService());
      await broker.start();
      const result = await service.sendDocument('valid', 'doc');
      expect(service.bot.sendDocument).toHaveBeenCalledTimes(1);
      expect(result).toBe(sampleMessage);
      await broker.stop();
      broker.destroyService(service);
    });

    it('should call bot.sendDocument and return with error', async () => {
      const service = broker.createService(TelegramService());
      await broker.start();
      await expect(service.sendDocument('')).rejects.toThrow(new MoleculerError(`${error.message}`, 500, 'SENDDOCUMENT_ERROR', error.response.body));
      expect(service.bot.sendDocument).toHaveBeenCalledTimes(1);
      await broker.stop();
      broker.destroyService(service);
    });

    it('should call the sendDocument method successfully', async () => {
      const service = broker.createService(TelegramService());
      await broker.start();
      service.sendDocument = sendMock;
      const res = await broker.call('telegram.sendDocument', { to: 'valid', doc: 'http://' });
      expect(res).toBe(sampleMessage);
      expect(service.sendDocument).toHaveBeenCalledTimes(1);
      expect(service.sendDocument).toHaveBeenCalledWith('valid', 'http://', {}, undefined);
      await broker.stop();
      broker.destroyService(service);
    });
  });
});
