import { Stream } from 'stream';
import { ActionHandler, ActionParams } from 'moleculer';
import TelegramBot from 'node-telegram-bot-api';

declare module 'moleculer-telegram-bot' {   
    interface telegramFileOptions {
        fileOpts?: {
            filename?: string;
            contentType?: string;
        };
    }

    interface sendMessageParams extends TelegramBot.SendMessageOptions, ActionParams {
        to: string | 'number';
        message: string;
        reply_to_message_id?: any;
    }

    interface sendPhotoParams extends TelegramBot.SendPhotoOptions, telegramFileOptions, ActionParams {
        to: string | 'number';
        photo: string;
        reply_to_message_id?: any;
    }

    interface sendDocumentParams extends TelegramBot.SendDocumentOptions, telegramFileOptions, ActionParams {
        to: string | 'number';
        doc: string;
        reply_to_message_id?: any;
    }

    type telegramBotService = {
        name: string;
        settings: { 
            telegramToken: string;
            telegramTarget: string;
        },
        actions: {
            sendMessage: {
                params: sendMessageParams;
                handler: ActionHandler;
            };
    
            sendPhoto: {
                params: sendPhotoParams;
                handler: ActionHandler;
            };
    
            sendDocument: {
                params: sendDocumentParams
                handler: ActionHandler;
            };
        },
        methods: {
            sendMessage(to: string | number, message: string, opts: TelegramBot.SendMessageOptions): Promise<TelegramBot.Message>;
            sendPhoto(to: string | number, photo: string | Stream | Buffer, opts: TelegramBot.SendPhotoOptions, fileOpts: telegramFileOptions): Promise<TelegramBot.Message>;
            sendDocument(to: string | number, doc: string | Stream | Buffer, opts: TelegramBot.SendDocumentOptions, fileOpts: telegramFileOptions): Promise<TelegramBot.Message>;
        },
    };

    type serviceOptions = {
        target?: string;
        token?: string;
    };

    export default function(serviceOpts?: serviceOptions): telegramBotService;
}
